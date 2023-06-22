export default (profileName: string) => {
  return JSON.stringify({
    browser: {
      shortcut_migration_version: "109.0.5412.0",
    },
    chrome_labs_new_badge_dict: {
      "webui-tab-strip": -1,
    },
    hardware_acceleration_mode_previous: true,
    invalidation: {
      per_sender_topics_to_handler: {},
    },
    legacy: {
      profile: {
        name: {
          migrated: true,
        },
      },
    },
    management: {
      platform: {
        azure_active_directory: 0,
        enterprise_mdm_win: 0,
      },
    },
    os_crypt: {
      encrypted_key:
        "RFBBUEkBAAAA0Iyd3wEV0RGMegDAT8KX6wEAAAD6sJ2ASnYbQpWxNQOw5X2gAAAAAAIAAAAAABBmAAAAAQAAIAAAAGvS9goZtBrflipgyc77Ekz6H4SgRoAezge4K9WFYaZ5AAAAAA6AAAAAAgAAIAAAAGx1f7fv+eVQVF88ecJM8h0cF1mVRFTMBY5hzpSPkCecMAAAADHwDx9Yf6GIeLJObVweaLMhRxa4xgzsnZBo1aZipCWuYrMMY4iPZ3cywUQmVTCAkEAAAABeuVtsvw+gtBJEyTltsmqz3V9QYHlsC+VGiiChqQUD+hMIBi5rKi9ndUvD1Jr2MVDld3+z/WN0JO+YbC8zrNlx",
    },
    policy: {
      last_statistics_update: "13316357129986996",
    },
    privacy_budget: {
      block_offset: 10,
      generation: 8,
    },
    profile: {
      info_cache: {
        Default: {
          active_time: 1671883530.138722,
          avatar_icon: "chrome://theme/default_theme",
          background_apps: false,
          default_avatar_fill_color: -16777216,
          default_avatar_stroke_color: -1,
          force_signin_profile_locked: false,
          gaia_given_name: "",
          gaia_id: "",
          gaia_name: "",
          hosted_domain: "",
          is_consented_primary_account: false,
          is_ephemeral: false,
          is_using_default_avatar: false,
          is_using_default_name: false,
          managed_user_id: "",
          metrics_bucket_index: 1,
          name: profileName,
          profile_highlight_color: -16777216,
          "signin.with_credential_provider": false,
          use_gaia_picture: true,
          user_name: profileName,
        },
      },
      last_active_profiles: [],
      metrics: {
        next_bucket_index: 2,
      },
      profile_counts_reported: "13316357129991255",
    },
    profile_network_context_service: {
      http_cache_finch_experiment_groups:
        "Experiment_Triple_Key_20201001 None None None",
    },
    session_id_generator_last_value: "1759486429",
    shutdown: {
      num_processes: 4,
      num_processes_slow: 0,
      type: 1,
    },
    subresource_filter: {
      ruleset_version: {
        checksum: 0,
        content: "",
        format: 0,
      },
    },
    tab_stats: {
      discards_external: 0,
      discards_urgent: 0,
      last_daily_sample: "13316357130152124",
      max_tabs_per_window: 3,
      reloads_external: 0,
      reloads_urgent: 0,
      total_tab_count_max: 3,
      window_count_max: 1,
    },
    ukm: {
      persisted_logs: [],
    },
    uninstall_metrics: {
      installation_date2: "1671883529",
    },
    user_experience_metrics: {
      client_id2: "6fb304f9-d4ef-4b66-81db-ccc18230c101",
      client_id_timestamp: "1671883529",
      low_entropy_source3: 58,
      machine_id: 4279123,
      pseudo_low_entropy_source: 6287,
      session_id: 1,
      stability: {
        browser_last_live_timestamp: "13316357192290655",
        exited_cleanly: true,
        saved_system_profile:
          "CND+nJsGEhUxMDkuMC41NDEyLjAtNjQtZGV2ZWwYwNObnQYiBWVuLVVTKhgKCldpbmRvd3MgTlQSCjEwLjAuMTkwNDQyawoGeDg2XzY0EP16GICAgK/1/x8iCEhWWS1XWFg5KAEwgA84uAhCCggAEAAaADIAOgBN6V8JQ1X2KAlDZQAAgD9qFwoMQXV0aGVudGljQU1EEIGemAQYDCAAggEAigEAqgEGeDg2XzY0sAEBSgoNvlc5MRXSTPQ+SgoNHZn3exXfF0o/SgoNISg+ARXhxKRGSgoNvJ8LKBXfF0o/SgoNdm9HnxXfF0o/SgoNewi3+BX09Ec9SgoNBghXZRVa5Xs3SgoNFj/TPxVW/FHaSgoNUu7VNhXfF0o/SgoNbSM6XhXQhuJZSgoNO8DMixXfF0o/SgoNmgNJUxXfF0o/SgoNPD1J2hXfF0o/SgoNbUjt8xXfF0o/SgoNgvkeQRV+hXwASgoNtfX4TxVSpPfKSgoNakM2XxVewZn3SgoN6+/jrRUUD8zhSgoNOvhZ2xXfF0o/SgoN8SG/+hXfF0o/SgoNJka4FxXfF0o/SgoNkrdXsxXfF0o/UABqDAgAEAAYACAGOABAAIABwNObnQaYAQD4ATqAAv///////////wGIAgCSAiQ2ZmIzMDRmOS1kNGVmLTRiNjYtODFkYi1jY2MxODIzMGMxMDGoAo8xsgJ8ZB450jfirX7FiAAqfsiwbNubM6kLj70v2MAtsUZ0NDoqfizFTLRUE1QfjfLKZX4bY3cefXlLqmkeDEaN52w1Ym/ZQWGx1MW37INtJMhARP75DDb0tRCH0mCOPFXWxgqmOQvdomPrbd3PaDN/6BJXNoSLuP9M8w1de7wNAw==",
        saved_system_profile_hash: "1D674F8360A7D3763C60030B5E327CF1079F422D",
        stats_buildtime: "1667710800",
        stats_version: "109.0.5412.0-64-devel",
        system_crash_count: 0,
      },
    },
    was: {
      restarted: false,
    },
  });
};
