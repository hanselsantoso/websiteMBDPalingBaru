import * as migration_20261125_011658_standalone_initial from './20261125_011658_standalone_initial';

export const migrations = [
  {
    up: migration_20261125_011658_standalone_initial.up,
    down: migration_20261125_011658_standalone_initial.down,
    name: '20261125_011658_standalone_initial'
  },
];
