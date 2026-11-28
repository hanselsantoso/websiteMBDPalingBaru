import * as migration_20261125_011658_standalone_initial from './20261125_011658_standalone_initial';
import * as migration_20261128_014822_mcp_content_accounts from './20261128_014822_mcp_content_accounts';
import * as migration_20261128_063057_content_translations from './20261128_063057_content_translations';
import * as migration_20261128_111852_pivot_branding_defaults from './20261128_111852_pivot_branding_defaults';

export const migrations = [
  {
    up: migration_20261125_011658_standalone_initial.up,
    down: migration_20261125_011658_standalone_initial.down,
    name: '20261125_011658_standalone_initial',
  },
  {
    up: migration_20261128_014822_mcp_content_accounts.up,
    down: migration_20261128_014822_mcp_content_accounts.down,
    name: '20261128_014822_mcp_content_accounts',
  },
  {
    up: migration_20261128_063057_content_translations.up,
    down: migration_20261128_063057_content_translations.down,
    name: '20261128_063057_content_translations',
  },
  {
    up: migration_20261128_111852_pivot_branding_defaults.up,
    down: migration_20261128_111852_pivot_branding_defaults.down,
    name: '20261128_111852_pivot_branding_defaults'
  },
];
