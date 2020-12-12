module.exports = {
  drawInfo: {
    frame: {
      mapInfo: {
        width: 800,
        height: 1100,
        backgroundInfo: { backgroundPosition: [0, 0] },
      },
      svgModelResourceList: [
        {
          id: 'sensorArea',
          type: 'rect',
          elementDrawInfo: {
            width: 200,
            height: 500,
            color: ['url(#bg-gray-1)'],
            filterInfo: { filter: 'url(#dropShadow)' },
          },
          textStyleInfo: { color: '', fontSize: 30, axisScale: [0.5, -0.07] },
        },
        {
          id: 'deviceArea',
          type: 'rect',
          elementDrawInfo: {
            width: 200,
            height: 500,
            color: ['url(#bg-sky-1)'],
            filterInfo: { filter: 'url(#dropShadow)' },
          },
          textStyleInfo: { color: '', fontSize: 30, axisScale: [0.5, -0.07] },
        },
        {
          id: 'commandArea',
          type: 'rect',
          elementDrawInfo: {
            width: 200,
            height: 500,
            color: ['url(#bg-sky-2)'],
            filterInfo: { filter: 'url(#dropShadow)' },
          },
          textStyleInfo: { color: '', fontSize: 30, axisScale: [0.5, -0.07] },
        },
        {
          id: 'valve',
          type: 'rect',
          elementDrawInfo: {
            width: 160,
            height: 75,
            svgClass: ['lightGray', 'green'],
            filterInfo: { filter: 'url(#deviceShadow)' },
            color: [null],
          },
          textStyleInfo: { fontSize: 20 },
        },
        {
          id: 'compressor',
          type: 'rect',
          elementDrawInfo: {
            width: 160,
            height: 75,
            svgClass: ['lightGray', 'blue'],
            filterInfo: { filter: 'url(#deviceShadow)' },
            color: [null],
          },
          textStyleInfo: { fontSize: 20 },
        },
        {
          id: 'cmdBtn',
          type: 'rect',
          elementDrawInfo: {
            width: 160,
            height: 75,
            svgClass: ['lightGray', 'orange'],
            filterInfo: { filter: 'url(#deviceShadow)' },
            color: [null],
          },
          textStyleInfo: { fontSize: 20 },
        },
        {
          id: 'pressure',
          type: 'rect',
          elementDrawInfo: {
            width: 160,
            height: 75,
            svgClass: ['white'],
            filterInfo: { filter: 'url(#deviceShadow)' },
            color: [null],
          },
          textStyleInfo: { fontSize: 20 },
        },
      ],
    },
    positionInfo: {
      svgPlaceList: [
        { id: 'SA', name: '센서', point: [70, 70, 270, 570], resourceId: 'sensorArea' },
        {
          id: 'DA',
          name: '단일 제어',
          point: [320, 70, 520, 570],
          resourceId: 'deviceArea',
        },
        {
          id: 'CA',
          name: '명령 제어',
          point: [570, 70, 770, 570],
          resourceId: 'commandArea',
        },
      ],
      svgNodeList: [
        {
          id: 'V_1',
          name: '해수 공급 밸브',
          cursor: 'pointer',
          is_sensor: 0,
          resourceId: 'valve',
          placeId: 'DA',
          point: [340, 112.5],
        },
        {
          id: 'V_2',
          name: '상시 개방 밸브 A',
          cursor: 'pointer',
          is_sensor: 0,
          resourceId: 'valve',
          placeId: 'DA',
          point: [340, 227.25],
        },
        {
          id: 'V_3',
          name: '상시 개방 밸브 B',
          cursor: 'pointer',
          is_sensor: 0,
          resourceId: 'valve',
          placeId: 'DA',
          point: [340, 337.75],
        },
        {
          id: 'CP',
          name: '공기 압축기',
          cursor: 'pointer',
          is_sensor: 0,
          resourceId: 'compressor',
          placeId: 'DA',
          point: [340, 452.5],
        },
        {
          id: 'BAR_A',
          name: '탱크 압력 A',
          cursor: '',
          is_sensor: 1,
          resourceId: 'pressure',
          placeId: 'SA',
          point: [90, 112.5],
        },
        {
          id: 'BAR_B',
          name: '탱크 압력 B',
          cursor: '',
          is_sensor: 1,
          resourceId: 'pressure',
          placeId: 'SA',
          point: [90, 227.25],
        },
      ],
      svgCmdList: [
        {
          cmdFormat: 'SCENARIO',
          id: 'systemOn',
          name: '시스템 가동',
          cursor: 'pointer',
          resourceId: 'cmdBtn',
          placeId: 'CA',
          point: [590, 112.5],
        },
        {
          cmdFormat: 'SCENARIO',
          id: 'airSystem',
          name: '에어 시스템',
          cursor: 'pointer',
          resourceId: 'cmdBtn',
          placeId: 'CA',
          point: [590, 227.25],
        },
      ],
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
            parser: 'delimiterParser',
            option: { type: 'Buffer', data: [4] },
          },
          host: 'localhost',
          port: 9999,
        },
      },
    ],
    dpcConstructorList: [
      {
        dpcId: 'DPC_001',
        protocol_info: {
          mainCategory: 'NI',
          subCategory: 'cDaq',
          cmdExecTimeoutMs: 5000,
          protocolOptionInfo: { hasTrackingData: true },
          option: { ni: { slotModelType: '9201' } },
        },
      },
      {
        dpcId: 'DPC_002',
        protocol_info: {
          mainCategory: 'NI',
          subCategory: 'cDaq',
          cmdExecTimeoutMs: 5000,
          protocolOptionInfo: { hasTrackingData: true },
          option: { ni: { slotModelType: '9482' } },
        },
      },
    ],
    dataLoggerStructureList: [
      {
        target_prefix: 'D_NI',
        target_name: 'NI-DAQmx',
        dataLoggerDeviceList: [
          {
            serial_number: '01EED6EF',
            subDeviceId: '01EE8DE7',
            target_code: '001',
            target_name: 'NI 9201',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: ['BAR_A', 'BAR_B'],
          },
          {
            serial_number: '01EE1809',
            subDeviceId: '01EE8DE7',
            target_code: '002',
            target_name: 'NI 9482 컴프레셔',
            dccId: 'DCC_001',
            dpcId: 'DPC_002',
            nodeList: ['CP'],
          },
          {
            serial_number: '01EE1869',
            subDeviceId: '01EE8DE7',
            target_code: '003',
            target_name: 'NI 9482 밸브',
            dccId: 'DCC_001',
            dpcId: 'DPC_002',
            nodeList: ['V_1', 'V_2', 'V_3'],
          },
        ],
      },
    ],
    nodeStructureList: [
      {
        target_id: 'valve',
        target_name: '밸브',
        is_sensor: 0,
        is_submit_api: 1,
        description: '개방 밸브',
        defList: [
          {
            target_id: 'valve',
            target_prefix: 'V',
            target_name: '밸브',
            nodeList: [
              {
                target_code: '1',
                target_name: '해수 공급 밸브',
                data_logger_index: 0,
                data_index: 0,
                svgNodePosOpt: {
                  resourceId: 'valve',
                  axisScale: [0.5, 0.1],
                  moveScale: [0, 0],
                },
              },
              {
                target_code: '2',
                target_name: '상시 개방 밸브 A',
                data_logger_index: 1,
                data_index: 1,
                svgNodePosOpt: {
                  resourceId: 'valve',
                  axisScale: [0.5, 0.37],
                  moveScale: [0, 0],
                },
              },
              {
                target_code: '3',
                target_name: '상시 개방 밸브 B',
                data_logger_index: 2,
                data_index: 2,
                svgNodePosOpt: {
                  resourceId: 'valve',
                  axisScale: [0.5, 0.63],
                  moveScale: [0, 0],
                },
              },
            ],
          },
        ],
      },
      {
        target_id: 'compressor',
        target_name: '컴프레셔',
        is_sensor: 0,
        defList: [
          {
            target_id: 'compressor',
            target_prefix: 'CP',
            target_name: '컴프레셔',
            nodeList: [
              {
                target_name: '공기 압축기',
                data_logger_index: 0,
                data_index: 0,
                svgNodePosOpt: {
                  resourceId: 'compressor',
                  axisScale: [0.5, 0.9],
                  moveScale: [0, 0],
                },
              },
            ],
          },
        ],
      },
      {
        target_id: 'pressure',
        target_name: '압력 센서',
        is_sensor: 1,
        description: '압력',
        data_unit: 'bar',
        defList: [
          {
            target_id: 'absPressure',
            target_prefix: 'BAR',
            target_name: '절대 압력',
            nodeList: [
              {
                target_code: 'A',
                target_name: '탱크 압력 A',
                data_logger_index: 0,
                data_index: 0,
                node_type: 'PXM309',
                svgNodePosOpt: { resourceId: 'pressure', axisScale: [0.5, 0.1] },
              },
              {
                target_code: 'B',
                target_name: '탱크 압력 B',
                data_logger_index: 1,
                data_index: 1,
                node_type: 'PXM309',
                svgNodePosOpt: { resourceId: 'pressure', axisScale: [0.5, 0.37] },
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
        target_id: 'Area',
        target_name: '장치 영역',
        defList: [
          {
            target_id: 'sensorArea',
            target_name: '센서',
            target_prefix: 'SA',
            placeList: [
              {
                nodeList: ['BAR_A', 'BAR_B'],
                svgPositionInfo: { resourceId: 'sensorArea', point: [70, 70] },
              },
            ],
          },
          {
            target_id: 'deviceArea',
            target_name: '단일 제어',
            target_prefix: 'DA',
            placeList: [
              {
                nodeList: ['V_1', 'V_2', 'V_3', 'CP'],
                svgPositionInfo: { resourceId: 'deviceArea', point: [320, 70] },
              },
            ],
          },
          {
            target_id: 'commandArea',
            target_name: '명령 제어',
            target_prefix: 'CA',
            placeList: [
              { svgPositionInfo: { resourceId: 'commandArea', point: [570, 70] } },
            ],
          },
        ],
      },
    ],
  },
  controlInfo: {
    singleCmdList: [
      {
        singleCmdName: '밸브 제어',
        applyDeviceList: ['valve'],
        singleMidCateCmdInfo: {
          scenarioMsg: '제어 동작을 선택하세요.',
          subCmdList: [
            { enName: 'Open', krName: '열음', controlValue: 1 },
            { enName: 'Close', krName: '닫음', controlValue: 0 },
          ],
        },
      },
      {
        singleCmdName: '공기 압축기 제어',
        applyDeviceList: ['compressor'],
        singleMidCateCmdInfo: {
          scenarioMsg: '제어 동작을 선택하세요.',
          subCmdList: [
            { enName: 'On', krName: '동작', controlValue: 1 },
            { enName: 'Off', krName: '정지', controlValue: 0 },
          ],
        },
      },
    ],
    setCmdList: [
      {
        cmdId: 'closeAllDevice',
        cmdName: '모든 장치 정지',
        falseNodeList: ['V_1', 'V_2', 'V_3', 'CP'],
      },
      {
        cmdId: 'closeValve',
        cmdName: '모든 밸브 폐쇄',
        falseNodeList: ['V_1', 'V_2', 'V_3'],
      },
      {
        cmdId: 'onSystem',
        cmdName: '시스템 On',
        trueNodeList: ['V_1'],
        falseNodeList: ['V_2', 'V_3', 'CP'],
      },
    ],
    scenarioCmdList: [
      {
        scenarioId: 'systemOn',
        scenarioName: '시스템 가동',
        svgNodePosOpt: { placeId: 'CA', resourceId: 'cmdBtn', axisScale: [0.5, 0.1] },
        scenarioList: [
          {
            wrapCmdFormat: 'SINGLE',
            singleControlType: 0,
            singleNodeId: ['V_2', 'V_3', 'CP'],
          },
          {
            wrapCmdFormat: 'SINGLE',
            singleControlType: 1,
            singleNodeId: 'V_1',
            wrapCmdGoalInfo: {
              limitTimeSec: 60,
              goalDataList: [{ nodeId: 'BAR_B', goalValue: 4, goalRange: 'UPPER' }],
            },
          },
        ],
      },
      {
        scenarioId: 'airSystem',
        scenarioName: '에어 시스템',
        scenarioCount: 2,
        svgNodePosOpt: { placeId: 'CA', resourceId: 'cmdBtn', axisScale: [0.5, 0.37] },
        scenarioList: [
          { wrapCmdFormat: 'SET', setCmdId: 'closeValve' },
          {
            wrapCmdFormat: 'SINGLE',
            singleNodeId: 'CP',
            singleControlSetValue: 1,
            wrapCmdGoalInfo: {
              limitTimeSec: 60,
              goalDataList: [{ nodeId: 'BAR_B', goalValue: 7, goalRange: 'UPPER' }],
            },
          },
          {
            wrapCmdFormat: 'SINGLE',
            singleNodeId: 'V_3',
            singleControlType: 1,
            wrapCmdGoalInfo: {
              limitTimeSec: 60,
              goalDataList: [{ nodeId: 'BAR_B', goalValue: 3, goalRange: 'LOWER' }],
            },
          },
        ],
      },
    ],
  },
};
