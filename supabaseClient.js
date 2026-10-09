/**
 * ============================================================================
 * FACULTY HUB – Supabase Client Singleton & Data Access Layer
 * Supports both Browser globals (CDN / script tag) & ES Module bundlers.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node / CommonJS
    var createClient = require('@supabase/supabase-js').createClient;
    module.exports = factory(createClient);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['@supabase/supabase-js'], factory);
  } else {
    // Browser global
    var createClient = (root.supabase && root.supabase.createClient) ? root.supabase.createClient : null;
    root.FacultyHubSupabase = factory(createClient);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (createClientFn) {
  'use strict';

  var CONFIG_KEY = 'fh_supabase_config';

  // Default fallback placeholders (can be overridden via localStorage or UI)
  var DEFAULT_URL = (typeof process !== 'undefined' && process.env && (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)) || '';
  var DEFAULT_KEY = (typeof process !== 'undefined' && process.env && (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) || '';

  var clientInstance = null;

  function getStoredConfig() {
    try {
      if (typeof localStorage !== 'undefined') {
        var raw = localStorage.getItem(CONFIG_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          if (parsed && parsed.url && parsed.key) return parsed;
        }
      }
    } catch (e) { /* ignore */ }
    return {
      url: DEFAULT_URL,
      key: DEFAULT_KEY
    };
  }

  function saveConfig(url, key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CONFIG_KEY, JSON.stringify({ url: (url || '').trim(), key: (key || '').trim() }));
      }
    } catch (e) { /* ignore */ }
    clientInstance = null; // reset singleton
  }

  function getClient() {
    if (clientInstance) return clientInstance;

    var config = getStoredConfig();
    var create = createClientFn || (typeof window !== 'undefined' && window.supabase && window.supabase.createClient);

    if (!create || !config.url || !config.key || config.url.includes('your-project-ref') || config.key.includes('placeholder')) {
      return null;
    }

    try {
      clientInstance = create(config.url, config.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return clientInstance;
    } catch (err) {
      console.warn('[Supabase] Failed to initialize client:', err);
      return null;
    }
  }

  /**
   * Test connection to Supabase instance
   */
  async function testConnection() {
    var client = getClient();
    if (!client) {
      return { ok: false, error: 'Supabase client is not configured. Please enter a valid URL and Anon Key.' };
    }
    try {
      var res = await client.from('faculty').select('count', { count: 'exact', head: true });
      if (res.error) throw res.error;
      return { ok: true, count: res.count };
    } catch (err) {
      return { ok: false, error: err.message || 'Unable to connect to Supabase database.' };
    }
  }

  /**
   * Fetch all app datasets from Supabase
   */
  async function fetchAllData() {
    var client = getClient();
    if (!client) return null;

    try {
      var [facRes, subRes, schRes, absRes, subFacRes] = await Promise.all([
        client.from('faculty').select('*').order('name'),
        client.from('subjects').select('*').order('code'),
        client.from('schedules').select('*'),
        client.from('absences').select('*'),
        client.from('substitutions').select('*'),
      ]);

      if (facRes.error) throw facRes.error;
      if (subRes.error) throw subRes.error;
      if (schRes.error) throw schRes.error;

      // Transform snake_case columns back to camelCase application state
      var faculty = (facRes.data || []).map(function (f) {
        return {
          id: f.id,
          name: f.name,
          department: f.department,
          designation: f.designation,
          email: f.email,
          maxHours: f.max_hours || 16,
        };
      });

      var subjects = (subRes.data || []).map(function (s) {
        return {
          id: s.id,
          code: s.code,
          name: s.name,
          department: s.department,
          hoursPerWeek: s.hours_per_week || 3,
        };
      });

      var schedules = (schRes.data || []).map(function (sc) {
        return {
          id: sc.id,
          facultyId: sc.faculty_id,
          subjectId: sc.subject_id,
          room: sc.room,
          day: sc.day,
          slotId: sc.slot_id,
        };
      });

      var absences = (absRes.data || []).map(function (a) {
        return {
          id: a.id,
          facultyId: a.faculty_id,
          date: a.date,
          slotId: a.slot_id,
        };
      });

      var substitutions = (subFacRes.data || []).map(function (sb) {
        return {
          id: sb.id,
          scheduleId: sb.schedule_id,
          date: sb.date,
          originalFacultyId: sb.original_faculty_id,
          substituteFacultyId: sb.substitute_faculty_id,
        };
      });

      return {
        faculty: faculty,
        subjects: subjects,
        schedules: schedules,
        absences: absences,
        substitutions: substitutions,
      };
    } catch (err) {
      console.error('[Supabase fetchAllData Error]:', err);
      throw err;
    }
  }

  /**
   * Sync complete local dataset to Supabase
   */
  async function pushAllData(data) {
    var client = getClient();
    if (!client || !data) return false;

    try {
      if (data.faculty && data.faculty.length) {
        var facRows = data.faculty.map(function (f) {
          return {
            id: f.id,
            name: f.name,
            department: f.department,
            designation: f.designation,
            email: f.email,
            max_hours: f.maxHours || 16,
          };
        });
        await client.from('faculty').upsert(facRows, { onConflict: 'id' });
      }

      if (data.subjects && data.subjects.length) {
        var subRows = data.subjects.map(function (s) {
          return {
            id: s.id,
            code: s.code,
            name: s.name,
            department: s.department,
            hours_per_week: s.hoursPerWeek || 3,
          };
        });
        await client.from('subjects').upsert(subRows, { onConflict: 'id' });
      }

      if (data.schedules && data.schedules.length) {
        var schRows = data.schedules.map(function (sc) {
          return {
            id: sc.id,
            faculty_id: sc.facultyId,
            subject_id: sc.subjectId,
            room: sc.room,
            day: sc.day,
            slot_id: sc.slotId,
          };
        });
        await client.from('schedules').upsert(schRows, { onConflict: 'id' });
      }

      return true;
    } catch (err) {
      console.error('[Supabase pushAllData Error]:', err);
      throw err;
    }
  }

  return {
    getClient: getClient,
    getStoredConfig: getStoredConfig,
    saveConfig: saveConfig,
    testConnection: testConnection,
    fetchAllData: fetchAllData,
    pushAllData: pushAllData,
    isConfigured: function () {
      var cfg = getStoredConfig();
      return !!(cfg.url && cfg.key && !cfg.url.includes('your-project-ref') && !cfg.key.includes('placeholder'));
    }
  };
});
