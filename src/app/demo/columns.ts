import {Column} from '../../ng-crud-table';

export function getColumnsPlayers(): Column[] {
  const columnsPlayers: Column[] = [
    {
      title: 'Id',
      name: 'id',
      sortable: true,
      filter: true,
      frozen: true,
      width: 100,
      formHidden: true,
      type: 'number',
      isPrimaryKey: true,
    },
    {
      title: 'Name',
      name: 'name',
      sortable: true,
      filter: true,
      frozen: true,
      width: 200,
      validation: {required: true, minLength: 2, pattern: '^[a-zA-Z ]+$'},
      editable: true,
    },
    {
      title: 'Race',
      name: 'race',
      sortable: true,
      filter: true,
      type: 'select',
      options: [
        {id: 'ASMODIANS', name: 'ASMODIANS'},
        {id: 'ELYOS', name: 'ELYOS'},
      ],
      validation: {required: true},
      editable: true,
    },
    {
      title: 'Cascading Select',
      name: 'note',
      editable: true,
      type: 'select',
      options: [
        {id: 'ASM1', name: 'ASM note 1', parentId: 'ASMODIANS'},
        {id: 'ASM2', name: 'ASM note 2', parentId: 'ASMODIANS'},
        {id: 'ASM3', name: 'ASM note 3', parentId: 'ASMODIANS'},
        {id: 'ASM4', name: 'ASM note 4', parentId: 'ASMODIANS'},
        {id: 'ELY1', name: 'ELY note 1', parentId: 'ELYOS'},
        {id: 'ELY2', name: 'ELY note 2', parentId: 'ELYOS'},
        {id: 'ELY3', name: 'ELY note 3', parentId: 'ELYOS'},
      ],
      dependsColumn: 'race',
      multiSelectFilter: true,
    },
    {
      title: 'Gender',
      name: 'gender',
      sortable: true,
      filter: true,
      type: 'radio',
      options: [
        {id: 'MALE', name: 'MALE'},
        {id: 'FEMALE', name: 'FEMALE'},
      ],
      editable: true,
    },
    {
      title: 'Exp',
      name: 'exp',
      sortable: true,
      filter: true,
      type: 'number',
      validation: {required: true, maxLength: 10, pattern: '^[0-9]+$'},
      editable: true,
    },
    {
      title: 'Last online',
      name: 'last_online',
      sortable: true,
      filter: true,
      type: 'datetime-local',
      editable: true,
    },
    {
      title: 'Account name',
      name: 'account_name',
      editable: true,
      type: 'select-popup',
      optionsUrl: 'assets/accounts.json',
      keyColumn: 'account_id',
    },
    {title: 'Account id', name: 'account_id', editable: true},
    {title: 'Player class', name: 'player_class', editable: true},
    {
      title: 'Online',
      name: 'online',
      editable: true,
      type: 'checkbox',
      options: [
        {id: 1, name: 'Online'}
      ]
    },
    {title: 'Cube size', name: 'cube_size', editable: true},
    {title: 'Broker Kinah', name: 'brokerKinah', editable: true},
    {title: 'Bind point', name: 'bind_point', editable: true},
    {title: 'X', name: 'x', editable: true},
    {title: 'Y', name: 'y', editable: true},
    {title: 'Z', name: 'z', editable: true},
    {title: 'Recoverexp', name: 'recoverexp', editable: true},
    {title: 'Heading', name: 'heading', editable: true},
    {title: 'World id', name: 'world_id', editable: true},
    {title: 'Creation date', name: 'creation_date', editable: true, type: 'datetime-local'},
    {title: 'Stigma slot size', name: 'advanced_stigma_slot_size', editable: true},
    {title: 'Warehouse size', name: 'warehouse_size', editable: true},
    {title: 'Mailbox Letters', name: 'mailboxLetters', editable: true},
    {title: 'Mailbox Unread', name: 'mailboxUnReadLetters', editable: true},
    {title: 'Title id', name: 'title_id', editable: true},
    {title: 'Repletion state', name: 'repletionstate', editable: true},
    {title: 'Rebirth id', name: 'rebirth_id', editable: true},
    {title: 'Member points', name: 'memberpoints', editable: true},
    {title: 'Marry player id', name: 'marry_player_id', editable: true},
    {title: 'Marry title', name: 'marrytitle', editable: true},
    {title: 'Bg points', name: 'bg_points', editable: true},
    {title: 'Personal rating', name: 'personal_rating', editable: true},
    {title: 'Quest status', name: 'quest.status', editable: true}
  ];
  return columnsPlayers;
}

export function getColumnsRank(): Column[] {
  const columnsRank: Column[] = [
    {title: 'player_id', name: 'player_id', width: 100},
    {title: 'daily_ap', name: 'daily_ap', width: 100},
    {title: 'weekly_ap', name: 'weekly_ap', width: 100},
    {title: 'ap', name: 'ap', width: 100},
    {title: 'rank', name: 'rank', width: 100},
    {title: 'top_ranking', name: 'top_ranking', width: 100},
    {title: 'old_ranking', name: 'old_ranking', width: 100},
    {title: 'daily_kill', name: 'old_ranking', width: 100},
    {title: 'weekly_kill', name: 'weekly_kill', width: 100},
    {title: 'all_kill', name: 'all_kill', width: 100},
    {title: 'max_rank', name: 'max_rank', width: 100},
    {title: 'last_kill', name: 'last_kill', width: 100},
    {title: 'last_ap', name: 'last_ap', width: 100},
    {title: 'last_update', name: 'last_update', width: 120}
  ];
  return columnsRank;
}

export function getColumnsInventory(): Column[] {
  const columnsInventory: Column[] = [
    {title: 'itemUniqueId', name: 'itemUniqueId', width: 100},
    {title: 'itemId', name: 'itemId', width: 100},
    {title: 'itemCount', name: 'itemCount', width: 100},
    {title: 'itemColor', name: 'itemColor', width: 100},
    {title: 'itemOwner', name: 'itemOwner', width: 100},
    {title: 'itemCreationTime', name: 'itemCreationTime'},
    {title: 'itemExistTime', name: 'itemExistTime'},
    {title: 'itemTradeTime', name: 'itemTradeTime'},
    {title: 'isEquiped', name: 'isEquiped'},
    {title: 'isSoulBound', name: 'isSoulBound'},
    {title: 'slot', name: 'slot'},
    {title: 'itemLocation', name: 'itemLocation'},
    {title: 'enchant', name: 'enchant'},
    {title: 'itemSkin', name: 'itemSkin'},
    {title: 'fusionedItem', name: 'fusionedItem'},
    {title: 'optionalSocket', name: 'optionalSocket'},
    {title: 'optionalFusionSocket', name: 'optionalFusionSocket'},
    {title: 'charge', name: 'charge'},
    {title: 'sealStats', name: 'sealStats'},
    {title: 'sealEndTime', name: 'sealEndTime'}
  ];
  return columnsInventory;
}

export function getTreeColumns(): Column[] {
  return [
    {
      title: 'Node',
      name: 'node',
      frozen: true,
      width: 250,
    },
    {
      title: 'Name',
      name: 'name',
      editable: true,
      validation: {required: true, minLength: 2, pattern: '^[a-zA-Z ]+$'},
      width: 250,
    },
    {
      title: 'Gender',
      name: 'gender',
      editable: true,
      type: 'radio',
      options: [
        {id: 'MALE', name: 'MALE'},
        {id: 'FEMALE', name: 'FEMALE'},
      ],
      width: 250,
    },
    {
      title: 'Cube_size',
      name: 'cube_size',
      editable: true,
      width: 250,
    },
    {
      title: 'Exp',
      name: 'exp',
      editable: true,
      width: 250,
    }
  ];
}
