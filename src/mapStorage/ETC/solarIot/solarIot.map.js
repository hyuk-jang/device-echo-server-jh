module.exports = {
  drawInfo: {
    frame: {
      mapInfo: {
        height: 200,
        width: 1000,
        backgroundInfo: { backgroundData: 'red', backgroundPosition: [0, 0] },
      },
      svgModelResourceList: [
        {
          id: 'deviceArea',
          type: 'rect',
          elementDrawInfo: {
            width: 800,
            height: 100,
            color: ['url(#bg-sky-1)'],
            opacity: 1,
            filterInfo: { filter: 'url(#deviceShadow)' },
          },
        },
        {
          id: 'cmdBtn',
          type: 'rect',
          elementDrawInfo: {
            width: 136,
            height: 80,
            svgClass: ['lightGray', 'orange', 'red'],
            filterInfo: { filter: 'url(#deviceShadow)' },
            color: [null],
          },
          textStyleInfo: { fontSize: 15 },
        },
        {
          id: 'sensor',
          type: 'rect',
          elementDrawInfo: {
            width: 136,
            height: 80,
            color: ['#f0f0f0'],
            strokeInfo: { width: 0.7, color: '#000' },
          },
          textStyleInfo: { color: '', fontSize: 15 },
        },
      ],
    },
    positionInfo: {
      svgPlaceList: [
        {
          id: 'DA_001',
          name: '장치 영역 001',
          point: [100, 50, 900, 150],
          resourceId: 'deviceArea',
        },
        {
          id: 'DA_002',
          name: '장치 영역 002',
          point: [100, 50, 900, 150],
          resourceId: 'deviceArea',
        },
        {
          id: 'DA_003',
          name: '장치 영역 003',
          point: [100, 50, 900, 150],
          resourceId: 'deviceArea',
        },
        {
          id: 'DA_004',
          name: '장치 영역 004',
          point: [100, 50, 900, 150],
          resourceId: 'deviceArea',
        },
      ],
      svgNodeList: [
        {
          id: 'B_P',
          name: '배터리 용량',
          cursor: '',
          is_sensor: 1,
          resourceId: 'sensor',
          placeId: 'DA_001',
          point: [119.92, 60],
        },
        {
          id: 'R_1',
          name: 'Lv.1',
          cursor: 'pointer',
          is_sensor: 0,
          resourceId: 'cmdBtn',
          placeId: 'DA_001',
          point: [275.96, 60],
        },
        {
          id: 'R_2',
          name: 'Lv.2',
          cursor: 'pointer',
          is_sensor: 0,
          resourceId: 'cmdBtn',
          placeId: 'DA_002',
          point: [432, 60],
        },
        {
          id: 'R_3',
          name: 'Lv.3',
          cursor: 'pointer',
          is_sensor: 0,
          resourceId: 'cmdBtn',
          placeId: 'DA_003',
          point: [588.04, 60],
        },
        {
          id: 'R_4',
          name: 'Lv.4',
          cursor: 'pointer',
          is_sensor: 0,
          resourceId: 'cmdBtn',
          placeId: 'DA_004',
          point: [744.08, 60],
        },
      ],
      svgCmdList: [],
    },
  },
  setInfo: {
    mainInfo: { uuid: 'sector_001' },
    dccConstructorList: [
      {
        dccId: 'DCC_001',
        connect_info: {
          type: 'socket',
          subType: 'parser',
          addConfigInfo: {
            parser: 'readLineParser',
            option: { type: 'Buffer', data: [44, 79, 75, 0] },
          },
          hasOnDataClose: true,
          host: '192.168.0.158',
          port: 15800,
        },
      },
      {
        dccId: 'DCC_003',
        connect_info: {
          type: 'socket',
          subType: 'parser',
          addConfigInfo: {
            parser: 'readLineParser',
            option: { type: 'Buffer', data: [44, 79, 75, 0] },
          },
          host: '192.168.0.158',
          port: 'COM3',
        },
      },
      {
        dccId: 'DCC_004',
        connect_info: {
          type: 'socket',
          subType: 'parser',
          addConfigInfo: {
            parser: 'delimiterParser',
            option: { type: 'Buffer', data: [3] },
          },
          host: '192.168.0.158',
          port: 15803,
        },
      },
    ],
    dpcConstructorList: [
      {
        dpcId: 'DPC_001',
        protocol_info: { mainCategory: 'ETC', subCategory: 'Kincony' },
      },
      { dpcId: 'DPC_002', protocol_info: { mainCategory: 'ETC', subCategory: 'BatSm' } },
    ],
    dataLoggerStructureList: [
      {
        target_prefix: 'D_KIN',
        target_name: '릴레이 로거(Kincony)',
        dataLoggerDeviceList: [
          {
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            target_code: '001',
            target_name: 'Lv.1 ~ Lv.4',
            nodeList: ['R_1', 'R_2', 'R_3', 'R_4'],
          },
        ],
      },
      {
        target_prefix: 'D_B_P',
        target_name: '배터리 로거',
        dataLoggerDeviceList: [
          { dccId: 'DCC_004', dpcId: 'DPC_002', target_code: '003', nodeList: ['B_P'] },
        ],
      },
    ],
    nodeStructureList: [
      {
        target_id: 'battery',
        target_name: '배터리',
        data_unit: '%',
        is_sensor: 1,
        defList: [
          {
            target_id: 'percentBattery',
            target_name: '배터리 용량',
            target_prefix: 'B_P',
            nodeList: [
              {
                svgNodePosOpt: {
                  resourceId: 'sensor',
                  axisScale: [0.03, 0.5],
                  moveScale: [0, 0],
                  placeId: 'DA_001',
                },
              },
            ],
          },
        ],
      },
      {
        target_id: 'relay',
        target_name: '릴레이',
        is_sensor: 0,
        defList: [
          {
            target_id: 'relay',
            target_name: '릴레이',
            target_prefix: 'R',
            nodeList: [
              {
                target_code: '1',
                target_name: 'Lv.1',
                data_logger_index: 0,
                data_index: 1,
                svgNodePosOpt: {
                  resourceId: 'cmdBtn',
                  axisScale: [0.265, 0.5],
                  placeId: 'DA_001',
                },
              },
              {
                target_code: '2',
                target_name: 'Lv.2',
                data_logger_index: 1,
                data_index: 2,
                svgNodePosOpt: {
                  resourceId: 'cmdBtn',
                  axisScale: [0.5, 0.5],
                  placeId: 'DA_002',
                },
              },
              {
                target_code: '3',
                target_name: 'Lv.3',
                data_logger_index: 2,
                data_index: 3,
                svgNodePosOpt: {
                  resourceId: 'cmdBtn',
                  axisScale: [0.735, 0.5],
                  placeId: 'DA_003',
                },
              },
              {
                target_code: '4',
                target_name: 'Lv.4',
                data_logger_index: 3,
                data_index: 4,
                svgNodePosOpt: {
                  resourceId: 'cmdBtn',
                  axisScale: [0.97, 0.5],
                  placeId: 'DA_004',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  relationInfo: {
    placeRelationList: [
      {
        target_id: 'deviceArea',
        target_name: '장치 영역',
        defList: [
          {
            target_id: 'deviceArea',
            target_prefix: 'DA',
            placeList: [
              {
                target_code: '001',
                nodeList: ['R_1', 'B_P'],
                place_info: {
                  thresholdConfigList: [
                    {
                      ndId: 'percentBattery',
                      upperLimitValue: { value: 40 },
                      lowerLimitValue: { value: 25 },
                    },
                  ],
                },
                svgPositionInfo: { resourceId: 'deviceArea', point: [100, 50] },
              },
              {
                target_code: '002',
                nodeList: ['R_2', 'B_P'],
                place_info: {
                  thresholdConfigList: [
                    {
                      ndId: 'percentBattery',
                      upperLimitValue: { value: 50 },
                      lowerLimitValue: { value: 40 },
                    },
                  ],
                },
                svgPositionInfo: { resourceId: 'deviceArea', point: [100, 50] },
              },
              {
                target_code: '003',
                nodeList: ['R_3', 'B_P'],
                place_info: {
                  thresholdConfigList: [
                    {
                      ndId: 'percentBattery',
                      upperLimitValue: { value: 60 },
                      lowerLimitValue: { value: 50 },
                    },
                  ],
                },
                svgPositionInfo: { resourceId: 'deviceArea', point: [100, 50] },
              },
              {
                target_code: '004',
                nodeList: ['R_4', 'B_P'],
                place_info: {
                  thresholdConfigList: [
                    {
                      ndId: 'percentBattery',
                      upperLimitValue: { value: 70 },
                      lowerLimitValue: { value: 60 },
                    },
                  ],
                },
                svgPositionInfo: { resourceId: 'deviceArea', point: [100, 50] },
              },
            ],
          },
        ],
      },
    ],
  },
  controlInfo: {
    singleCmdList: [
      {
        applyDeviceList: ['relay'],
        singleCmdName: '릴레이',
        singleMidCateCmdInfo: {
          scenarioMsg: '제어 동작을 선택하세요.',
          subCmdList: [
            { enName: 'ON', krName: '동작', controlValue: 1 },
            { enName: 'OFF', krName: '정지', controlValue: 0 },
          ],
        },
      },
    ],
    setCmdList: [
      {
        cmdId: 'closeAllDevice',
        cmdName: '모든 장치 닫기',
        trueNodeList: [],
        falseNodeList: ['R_1', 'R_2', 'R_3', 'R_4'],
      },
      {
        cmdId: 'onUpToLv1',
        cmdName: 'Lv.1까지 가동',
        trueNodeList: ['R_1'],
        falseNodeList: ['R_2', 'R_3', 'R_4'],
      },
      {
        cmdId: 'onUpToLv2',
        cmdName: 'Lv.2까지 가동',
        trueNodeList: ['R_1', 'R_2'],
        falseNodeList: ['R_3', 'R_4'],
      },
      {
        cmdId: 'onUpToLv3',
        cmdName: 'Lv.3까지 가동',
        trueNodeList: ['R_1', 'R_2', 'R_3'],
        falseNodeList: ['R_4'],
      },
      {
        cmdId: 'onUpToLv4',
        cmdName: 'Lv.4까지 가동',
        trueNodeList: ['R_1', 'R_2', 'R_3', 'R_4'],
        falseNodeList: [],
      },
    ],
  },
};
