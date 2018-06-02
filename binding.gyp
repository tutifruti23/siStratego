{
  "targets": [
          {
              "target_name": "engine",
              "sources": [ "engine.cpp" ],
              "include_dirs": [
                  "<!(node -e \"require('nan')\")"
              ]
          }
      ]
  }