export type Agreement = {
  "version": "0.1.0",
  "name": "agreement",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "postBuffer",
          "type": "publicKey"
        },
        {
          "name": "amountGuranteed",
          "type": "u64"
        },
        {
          "name": "amountTotal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateAmount",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractor",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "amountGuranteed",
          "type": "u64"
        },
        {
          "name": "amountTotal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancel",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "open",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractor",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "openTo",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractor",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "openTo",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "accept",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractee",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "complete",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "dispute",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "userDispute",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractee",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "destination",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "contract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contractor",
            "type": "publicKey"
          },
          {
            "name": "contractee",
            "type": "publicKey"
          },
          {
            "name": "amountGuranteed",
            "type": "u64"
          },
          {
            "name": "amountTotal",
            "type": "u64"
          },
          {
            "name": "state",
            "type": {
              "defined": "ContractState"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "postBuffer",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ContractState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialized"
          },
          {
            "name": "Open"
          },
          {
            "name": "OpenTo"
          },
          {
            "name": "Accepeted"
          },
          {
            "name": "Disputed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAccount"
    },
    {
      "code": 6001,
      "name": "ImmutableState"
    }
  ]
};

export const IDL: Agreement = {
  "version": "0.1.0",
  "name": "agreement",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractor",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "postBuffer",
          "type": "publicKey"
        },
        {
          "name": "amountGuranteed",
          "type": "u64"
        },
        {
          "name": "amountTotal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateAmount",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractor",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "amountGuranteed",
          "type": "u64"
        },
        {
          "name": "amountTotal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancel",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "open",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractor",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "openTo",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractor",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "openTo",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "accept",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractee",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "complete",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "dispute",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destination",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "userDispute",
      "accounts": [
        {
          "name": "contract",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contractee",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "destination",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "contract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contractor",
            "type": "publicKey"
          },
          {
            "name": "contractee",
            "type": "publicKey"
          },
          {
            "name": "amountGuranteed",
            "type": "u64"
          },
          {
            "name": "amountTotal",
            "type": "u64"
          },
          {
            "name": "state",
            "type": {
              "defined": "ContractState"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "postBuffer",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ContractState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialized"
          },
          {
            "name": "Open"
          },
          {
            "name": "OpenTo"
          },
          {
            "name": "Accepeted"
          },
          {
            "name": "Disputed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAccount"
    },
    {
      "code": 6001,
      "name": "ImmutableState"
    }
  ]
};
