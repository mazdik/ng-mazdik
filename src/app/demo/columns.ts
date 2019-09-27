import {ColumnBase as Column, Validators} from 'ng-mazdik-lib';

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
    },
    {
      title: 'Name',
      name: 'name',
      sortable: true,
      filter: true,
      frozen: true,
      width: 200,
      validatorFunc: Validators.get({required: true, minLength: 2, pattern: '^[a-zA-Z ]+$'}),
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
      validatorFunc: Validators.get({required: true}),
    },
    {
      title: 'Cascading Select',
      name: 'note',
      type: 'select-dropdown',
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
    },
    {
      title: 'Exp',
      name: 'exp',
      sortable: true,
      filter: true,
      type: 'number',
      validatorFunc: Validators.get({required: true, maxLength: 10, pattern: '^[0-9]+$'}),
    },
    {
      title: 'Last online',
      name: 'last_online',
      sortable: true,
      filter: true,
      type: 'datetime-local',
    },
    {
      title: 'Account name',
      name: 'account_name',
      type: 'select-popup',
      optionsUrl: 'assets/accounts.json',
      keyColumn: 'account_id',
    },
    {title: 'Account id', name: 'account_id'},
    {title: 'Player class', name: 'player_class'},
    {
      title: 'Online',
      name: 'online',
      type: 'checkbox',
      options: [
        {id: 1, name: 'Online'}
      ]
    },
    {title: 'Cube size', name: 'cube_size', type: 'number'},
    {title: 'Broker Kinah', name: 'brokerKinah'},
    {title: 'Bind point', name: 'bind_point'},
    {title: 'X', name: 'x'},
    {title: 'Y', name: 'y'},
    {title: 'Z', name: 'z'},
    {title: 'Recoverexp', name: 'recoverexp'},
    {title: 'Heading', name: 'heading'},
    {title: 'World id', name: 'world_id'},
    {title: 'Creation date', name: 'creation_date', type: 'datetime-local'},
    {title: 'Stigma slot size', name: 'advanced_stigma_slot_size'},
    {title: 'Warehouse size', name: 'warehouse_size'},
    {title: 'Mailbox Letters', name: 'mailboxLetters'},
    {title: 'Mailbox Unread', name: 'mailboxUnReadLetters'},
    {title: 'Title id', name: 'title_id'},
    {title: 'Repletion state', name: 'repletionstate'},
    {title: 'Rebirth id', name: 'rebirth_id'},
    {title: 'Member points', name: 'memberpoints'},
    {title: 'Quest status', name: 'quest.status'}
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
      validatorFunc: Validators.get({required: true, minLength: 2, pattern: '^[a-zA-Z ]+$'}),
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
      type: 'number',
    },
    {
      title: 'Exp',
      name: 'exp',
      editable: true,
      width: 250,
    }
  ];
}
