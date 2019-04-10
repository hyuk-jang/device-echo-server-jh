const {
  BLOCK,
  TROUBLE,
  NONE,
} = require('../../../../../default-intelligence').dcmConfigModel.nodeDataType;

/**
 * @type {mDeviceMap}
 */
const map = {
  drawInfo: {
    frame: {
      mapSize: {
        width: 880,
        height: 1230,
      },
      svgModelResourceList: [
        {
          id: 'salternBlock_001',
          type: 'rect',
          elementDrawInfo: {
            width: 100,
            height: 150,
            color: '#33ffff',
          },
        },
        {
          id: 'salternBlock_002',
          type: 'rect',
          elementDrawInfo: {
            width: 100,
            height: 150,
            color: '#33ffff',
          },
        },
        {
          id: 'salternLine_001',
          type: 'line',
          elementDrawInfo: {
            strokeWidth: 100,
            color: '#33ccff',
          },
        },
        {
          id: 'pump_001',
          type: 'circle',
          elementDrawInfo: {
            radius: 20,
            color: '#9fe667',
          },
        },
        {
          id: 'valve_001',
          type: 'rhombus',
          elementDrawInfo: {
            width: 20,
            height: 20,
            rotate: 45,
            color: '#efb4ce',
          },
        },
      ],
    },
    positionList: [{}],
  },
  setInfo: {
    mainInfo: {
      uuid: '001',
    },
    dccConstructorList: [
      {
        dccId: 'DCC_001',
        connect_info: {
          type: 'socket',
          subType: '',
          host: 'localhost',
          port: 9000,
          hasPassive: true,
        },
      },
    ],
    dpcConstructorList: [
      {
        dpcId: 'DPC_001',
        protocol_info: {
          mainCategory: 'FarmParallel',
          subCategory: 'dmTech',
          wrapperCategory: 'default',
          cmdExecTimeoutMs: 1000 * 2,
        },
      },
      {
        dpcId: 'DPC_IVT_001',
        protocol_info: {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          cmdExecTimeoutMs: 1000 * 6,
        },
      },
      {
        dpcId: 'DPC_IVT_002',
        protocol_info: {
          mainCategory: 'Inverter',
          subCategory: 's5500k',
          wrapperCategory: 'default',
          cmdExecTimeoutMs: 1000 * 10,
        },
      },
    ],
    repeatNodeList: [
      {
        repeatId: 'RE_NODE_IVT',
        repeatCategory: 'node',
        nodeList: [
          {
            target_code: '001',
            target_name: '나주 고정식 A (33kW 급)',
          },
          {
            target_code: '002',
            target_name: '나주 고정식 B (33kW 급)',
          },
          {
            target_code: '003',
            target_name: '나주 가변식 C (33kW 급)',
          },
        ],
      },
      {
        repeatId: 'RE_PREFIX_IVT',
        repeatCategory: 'prefix',
        nodeList: [
          'IVT_PV_V',
          'IVT_PV_A',
          'IVT_PV_KW',
          'IVT_G_RS_V',
          'IVT_G_ST_V',
          'IVT_G_TR_V',
          'IVT_G_R_A',
          'IVT_G_S_A',
          'IVT_G_T_A',
          'IVT_G_L_F',
          'IVT_PW_PV_KW',
          'IVT_PW_G_KW',
          'IVT_PW_C_KWH',
          'IVT_TRB',
        ],
      },
    ],
    dataLoggerStructureList: [
      {
        target_prefix: 'D_CE',
        target_name: 'Crops Environment (작물 생육 환경)',
        dataLoggerDeviceList: [
          {
            serial_number: 1,
            target_code: '001',
            target_name: '나주 고정식 A',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: [
              'LX_001',
              'S_I_001',
              'CO2_001',
              'WV_S_001',
              'T_PR_001',
              'T_S_001',
              'RH_S_001',
            ],
          },
          {
            serial_number: 2,
            target_code: '002',
            target_name: '나주 고정식 B',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: ['LX_002', 'S_PU_002', 'CO2_002', 'WV_S_002', 'T_S_002', 'RH_S_002'],
          },
          {
            serial_number: 3,
            target_code: '003',
            target_name: '나주 고정식 C',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: ['LX_003', 'CO2_003', 'WV_S_003', 'T_S_003', 'RH_S_003'],
          },
          {
            serial_number: 4,
            target_code: '004',
            target_name: '나주 가변식 A',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: [
              'LX_004',
              'S_I_004',
              'CO2_004',
              'WV_S_004',
              'T_PR_004',
              'T_S_004',
              'RH_S_004',
            ],
          },
          {
            serial_number: 5,
            target_code: '005',
            target_name: '나주 가변식 B',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: ['LX_005', 'S_PU_005', 'CO2_005', 'WV_S_005', 'T_S_005', 'RH_S_005'],
          },
          {
            serial_number: 6,
            target_code: '006',
            target_name: '나주 가변식 C',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: ['LX_006', 'CO2_006', 'WV_S_006', 'T_S_006', 'RH_S_006'],
          },
        ],
      },
      {
        target_prefix: 'D_OE',
        target_name: 'Outside Environment (외기 환경)',
        dataLoggerDeviceList: [
          {
            serial_number: 7,
            target_code: '007',
            target_name: '나주 외기 환경',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: [
              'LX_007',
              'S_H_007',
              'CO2_007',
              'WV_S_007',
              'T_S_007',
              'RH_S_007',
              'T_OA_007',
              'RH_OA_007',
              'W_D_007',
              'W_S_007',
              'RF1_007',
              'IR_007',
            ],
          },
        ],
      },
      {
        target_prefix: 'D_IVT',
        target_name: '인버터 DL',
        dataLoggerDeviceList: [
          {
            target_name: '나주 고정식 A (33kW 급)',
            serial_number: '001',
            target_code: '001',
            dccId: 'DCC_001',
            dpcId: 'DPC_IVT_001',
            repeatId: 'RE_PREFIX_IVT',
          },
          {
            target_name: '나주 고정식 B (33kW 급)',
            serial_number: '002',
            target_code: '002',
            dccId: 'DCC_001',
            dpcId: 'DPC_IVT_001',
            repeatId: 'RE_PREFIX_IVT',
          },
          {
            target_name: '나주 가변식 C (33kW 급)',
            serial_number: '003',
            target_code: '003',
            dccId: 'DCC_001',
            dpcId: 'DPC_IVT_001',
            repeatId: 'RE_PREFIX_IVT',
          },
        ],
      },
    ],
    nodeStructureList: [
      {
        target_id: 'temp',
        target_name: '온도',
        is_sensor: 1,
        // save_db_type: BLOCK,
        data_unit: '℃',
        description: '섭씨: 1 atm에서의 물의 어는점을 0도, 끓는점을 100도로 정한 온도',
        defList: [
          {
            target_id: 'soilTemperature',
            target_prefix: 'T_S',
            target_name: '토양 온도',
            nodeList: [
              {
                target_code: '001',
              },
              {
                target_code: '002',
              },
              {
                target_code: '003',
              },
              {
                target_code: '004',
              },
              {
                target_code: '005',
              },
              {
                target_code: '006',
              },
              {
                target_code: '007',
              },
            ],
          },
          {
            target_id: 'outsideAirTemperature',
            target_prefix: 'T_OA',
            target_name: '외기 온도',
            nodeList: [
              {
                target_code: '007',
              },
            ],
          },
          {
            target_id: 'pvRearTemperature',
            target_prefix: 'T_PR',
            target_name: '모듈 후면 온도',
            nodeList: [
              {
                target_code: '001',
              },
              {
                target_code: '004',
              },
            ],
          },
        ],
      },
      {
        target_id: 'reh',
        target_name: '습도',
        is_sensor: 1,
        // save_db_type: BLOCK,
        data_unit: '%RH',
        description: '공기 중에 포함되어 있는 수증기의 양 또는 비율을 나타내는 단위',
        defList: [
          {
            target_id: 'soilReh',
            target_prefix: 'RH_S',
            target_name: '토양 습도',
            nodeList: [
              {
                target_code: '001',
              },
              {
                target_code: '002',
              },
              {
                target_code: '003',
              },
              {
                target_code: '004',
              },
              {
                target_code: '005',
              },
              {
                target_code: '006',
              },
              {
                target_code: '007',
              },
            ],
          },
          {
            target_id: 'outsideAirReh',
            target_prefix: 'RH_OA',
            target_name: '외기 습도',
            nodeList: [
              {
                target_code: '007',
              },
            ],
          },
        ],
      },
      {
        target_id: 'ws',
        target_name: '풍속',
        is_sensor: 1,
        // save_db_type: BLOCK,
        data_unit: 'm/s',
        description: '초당 바람이 이동하는 거리(m)',
        defList: [
          {
            target_id: 'windSpeed',
            target_prefix: 'W_S',
            nodeList: [
              {
                target_code: '007',
              },
            ],
          },
        ],
      },
      {
        target_id: 'wd',
        target_name: '풍향',
        is_sensor: 1,
        // save_db_type: BLOCK,
        description: '풍향 0~7 (북, 북동, 동, 남동, 남, 남서, 서, 북서)',
        defList: [
          {
            target_id: 'windDirection',
            target_prefix: 'W_D',
            nodeList: [
              {
                target_code: '007',
              },
            ],
          },
        ],
      },
      {
        target_id: 'solar',
        target_name: '일사량',
        is_sensor: 1,
        // save_db_type: BLOCK,
        data_unit: 'W/m²',
        description: '1평방 미터당 조사되는 일사에너지의 양이 1W',
        defList: [
          {
            target_id: 'horizontalSolar',
            target_name: '수평 일사량',
            target_prefix: 'S_H',
            nodeList: [
              {
                target_code: '007',
              },
            ],
          },
          {
            target_id: 'inclinedSolar',
            target_name: '경사 일사량',
            target_prefix: 'S_I',
            nodeList: [
              {
                target_code: '001',
              },
              {
                target_code: '004',
              },
            ],
          },
          {
            target_id: 'pvUnderlyingSolar',
            target_name: '모듈 하부 일사량',
            target_prefix: 'S_PU',
            nodeList: [
              {
                target_code: '002',
              },
              {
                target_code: '005',
              },
            ],
          },
        ],
      },
      {
        target_id: 'rainfall',
        target_name: '강우량',
        is_sensor: 1,
        // save_db_type: BLOCK,
        data_unit: 'mm/hr',
        description: '시간당 일정한 곳에 내린 비의 분량. 단위는 mm',
        defList: [
          {
            target_id: 'r1',
            target_prefix: 'RF1',
            target_name: '시간당 강우량',
            nodeList: [
              {
                target_code: '007',
              },
            ],
          },
        ],
      },
      {
        target_id: 'isRain',
        target_name: '강우 감지 여부',
        is_sensor: 1,
        // save_db_type: BLOCK,
        description: '감지시 1, 미감지시 0',
        defList: [
          {
            target_id: 'isRain',
            target_prefix: 'IR',
            target_name: '강우 감지 여부',
            nodeList: [
              {
                target_code: '007',
              },
            ],
          },
        ],
      },
      {
        target_id: 'co2',
        target_name: '이산화탄소',
        is_sensor: 1,
        // save_db_type: BLOCK,
        data_unit: 'ppm',
        description: '백만분의 1. 이산화탄소 농도 395ppm = 395/1,000,000 * 100 = 0.0395 %',
        defList: [
          {
            target_id: 'co2',
            target_prefix: 'CO2',
            nodeList: [
              {
                target_code: '001',
              },
              {
                target_code: '002',
              },
              {
                target_code: '003',
              },
              {
                target_code: '004',
              },
              {
                target_code: '005',
              },
              {
                target_code: '006',
              },
              {
                target_code: '007',
              },
            ],
          },
        ],
      },
      {
        target_id: 'uv',
        target_name: '자외선',
        is_sensor: 1,
        // save_db_type: BLOCK,
        data_unit: 'mJ/c㎡',
        description: '1평방 센치당 조사되는 uv 에너지가 1mJ',
        defList: [],
      },
      {
        target_id: 'lux',
        target_name: '조도',
        is_sensor: 1,
        // save_db_type: BLOCK,
        data_unit: 'lx',
        description: '1㎡의 면적 위에 1m의 광속이 균일하게 비춰질 때',
        defList: [
          {
            target_id: 'lux',
            target_prefix: 'LX',
            nodeList: [
              {
                target_code: '001',
              },
              {
                target_code: '002',
              },
              {
                target_code: '003',
              },
              {
                target_code: '004',
              },
              {
                target_code: '005',
              },
              {
                target_code: '006',
              },
              {
                target_code: '007',
              },
            ],
          },
        ],
      },
      {
        target_id: 'waterValue',
        target_name: 'EC 값',
        is_sensor: 1,
        // save_db_type: BLOCK,
        data_unit: '%',
        description: '',
        defList: [
          {
            target_id: 'soilWaterValue',
            target_prefix: 'WV_S',
            target_name: '토양 EC 값',
            nodeList: [
              {
                target_code: '001',
              },
              {
                target_code: '002',
              },
              {
                target_code: '003',
              },
              {
                target_code: '004',
              },
              {
                target_code: '005',
              },
              {
                target_code: '006',
              },
              {
                target_code: '007',
              },
            ],
          },
        ],
      },
      {
        target_id: 'vol',
        target_name: '전압',
        is_sensor: 0,
        save_db_type: BLOCK,
        data_unit: 'V',
        description: null,
        defList: [
          {
            target_id: 'pvVol',
            target_name: '인버터 PV 전압',
            target_prefix: 'IVT_PV_V',
            repeatId: 'RE_NODE_IVT',
          },
          {
            target_id: 'gridRsVol',
            target_name: 'RS 선간 전압',
            target_prefix: 'IVT_G_RS_V',
            repeatId: 'RE_NODE_IVT',
          },
          {
            target_id: 'gridStVol',
            target_name: 'ST 선간 전압',
            target_prefix: 'IVT_G_ST_V',
            repeatId: 'RE_NODE_IVT',
          },
          {
            target_id: 'gridTrVol',
            target_name: 'TR 선간 전압',
            target_prefix: 'IVT_G_TR_V',
            repeatId: 'RE_NODE_IVT',
          },
        ],
      },
      {
        target_id: 'amp',
        target_name: '전류',
        is_sensor: 1,
        save_db_type: BLOCK,
        data_unit: 'A',
        description: null,
        defList: [
          {
            target_id: 'pvAmp',
            target_name: '인버터 PV 전류',
            target_prefix: 'IVT_PV_A',
            repeatId: 'RE_NODE_IVT',
          },
          {
            target_id: 'gridRAmp',
            target_name: '인버터 R상 전류',
            target_prefix: 'IVT_G_R_A',
            repeatId: 'RE_NODE_IVT',
          },
          {
            target_id: 'gridSAmp',
            target_name: '인버터 S상 전류',
            target_prefix: 'IVT_G_S_A',
            repeatId: 'RE_NODE_IVT',
          },
          {
            target_id: 'gridTAmp',
            target_name: '인버터 T상 전류',
            target_prefix: 'IVT_G_T_A',
            repeatId: 'RE_NODE_IVT',
          },
        ],
      },
      {
        target_id: 'W',
        target_name: '전력량',
        is_sensor: 1,
        save_db_type: BLOCK,
        data_unit: 'W',
        description: '1 와트(기호 W)는 1 초 동안의 1 줄(N·m)에 해당하는 일률의 SI 단위',
        defList: [],
      },
      {
        target_id: 'kW',
        target_name: '전력량',
        is_sensor: 1,
        save_db_type: BLOCK,
        data_unit: 'kW',
        description: '1 킬로와트(기호 kW)는 1 초 동안의 1,000 줄(N·m)에 해당하는 일률의 SI 단위',
        defList: [
          {
            target_id: 'pvKw',
            target_name: '인버터 PV 출력',
            target_prefix: 'IVT_PV_KW',
            description: 'PV',
            repeatId: 'RE_NODE_IVT',
          },
          {
            target_id: 'powerGridKw',
            target_name: '인버터 현재 전력',
            target_prefix: 'IVT_PW_G_KW',
            description: 'Power',
            repeatId: 'RE_NODE_IVT',
          },
        ],
      },
      {
        target_id: 'MW',
        target_name: '전력량',
        is_sensor: 1,
        save_db_type: BLOCK,
        data_unit: 'MW',
        description:
          '1 메가와트(기호 MW)는 1 초 동안의 1,000,000 줄(N·m)에 해당하는 일률의 SI 단위',
        defList: [],
      },
      {
        target_id: 'Wh',
        target_name: '전력량',
        is_sensor: 1,
        save_db_type: BLOCK,
        data_unit: 'Wh',
        description: '시간당 에너지 단위, 1 W의 일률로 1 시간 동안 하는 일의 양',
        defList: [],
      },
      {
        target_id: 'kWh',
        target_name: '전력량',
        is_sensor: 1,
        save_db_type: BLOCK,
        data_unit: 'kWh',
        description: '시간당 에너지 단위, 1 kW의 일률로 1 시간 동안 하는 일의 양',
        defList: [
          {
            target_id: 'powerDailyKwh',
            target_name: '인버터 하루 발전량',
            target_prefix: 'IVT_PW_D_KWH',
            repeatId: 'RE_NODE_IVT',
          },
          {
            target_id: 'powerCpKwh',
            target_name: '인버터 누적 발전량',
            target_prefix: 'IVT_PW_C_KWH',
            description: 'Cumulative Power Generation',
            repeatId: 'RE_NODE_IVT',
          },
        ],
      },
      {
        target_id: 'MWh',
        target_name: '전력량',
        is_sensor: 1,
        save_db_type: BLOCK,
        data_unit: 'MWh',
        description: '시간당 에너지 단위, 1 MW의 일률로 1 시간 동안 하는 일의 양',
        defList: [],
      },
      {
        target_id: 'powerFactor',
        target_name: '역률',
        is_sensor: 1,
        save_db_type: BLOCK,
        data_unit: '%',
        defList: [],
      },
      {
        target_id: 'frequency',
        target_name: '주파수',
        is_sensor: 1,
        save_db_type: BLOCK,
        data_unit: 'Hz',
        defList: [
          {
            target_id: 'gridLf',
            target_name: '계통 주파수',
            target_prefix: 'IVT_G_L_F',
            repeatId: 'RE_NODE_IVT',
          },
        ],
      },
      {
        target_id: 'trouble',
        target_name: '오류 목록',
        is_sensor: 1,
        save_db_type: TROUBLE,
        description: '장치에서 보내오는 이상 데이터',
        defList: [
          {
            target_id: 'operTroubleList',
            target_name: '인버터 에러',
            target_prefix: 'IVT_TRB',
            repeatId: 'RE_NODE_IVT',
          },
        ],
      },
    ],
  },
  relationInfo: {
    placeRelationList: [
      {
        target_id: 'inverter',
        target_name: '인버터',
        description: '인버터를 설치한 공간',
        defList: [
          {
            target_id: 'inverter',
            target_prefix: 'P_IVT',
            placeList: [
              {
                target_code: '001',
                target_name: '나주 고정식 A (33kW 급)',
                chart_color: '#212529',
                chart_sort_rank: 1,
                repeatId: 'RE_PREFIX_IVT',
                nodeList: ['S_I_001'],
              },
              {
                target_code: '002',
                target_name: '나주 고정식 B (33kW 급)',
                chart_color: '#fcc2d7',
                chart_sort_rank: 2,
                repeatId: 'RE_PREFIX_IVT',
                nodeList: ['S_I_001'],
              },
              {
                target_code: '003',
                target_name: '나주 가변식 C (33kW 급)',
                chart_color: '#d0bfff',
                chart_sort_rank: 3,
                repeatId: 'RE_PREFIX_IVT',
                nodeList: ['S_I_004'],
              },
            ],
          },
        ],
      },
      {
        target_id: 'farmParallelSite',
        target_name: '농업 병행 부지',
        description: '농업 병행 태양광 부지로 작물 생육 환경 센서가 존재',
        defList: [
          {
            target_id: 'fixingPV',
            target_prefix: 'PV_F',
            target_name: '고정식 태양광',
            placeList: [
              {
                target_code: '001',
                target_name: 'A',
                chart_color: '#212529',
                chart_sort_rank: 1,
                nodeList: [
                  'LX_001',
                  'S_I_001',
                  'CO2_001',
                  'WV_S_001',
                  'T_PR_001',
                  'T_S_001',
                  'RH_S_001',
                ],
              },
              {
                target_code: '002',
                target_name: 'B',
                chart_color: '#fcc2d7',
                chart_sort_rank: 2,
                nodeList: ['LX_002', 'S_PU_002', 'CO2_002', 'WV_S_002', 'T_S_002', 'RH_S_002'],
              },
              {
                target_code: '003',
                target_name: 'C',
                chart_color: '#d0bfff',
                chart_sort_rank: 3,
                nodeList: ['LX_003', 'CO2_003', 'WV_S_003', 'T_S_003', 'RH_S_003'],
              },
            ],
          },
          {
            target_id: 'variablePV',
            target_prefix: 'PV_V',
            target_name: '가변식 태양광',
            placeList: [
              {
                target_code: '004',
                target_name: 'A',
                chart_color: '#99e9f2',
                chart_sort_rank: 4,
                nodeList: [
                  'LX_004',
                  'S_I_004',
                  'CO2_004',
                  'WV_S_004',
                  'T_PR_004',
                  'T_S_004',
                  'RH_S_004',
                ],
              },
              {
                target_code: '005',
                target_name: 'B',
                chart_color: '#212529',
                chart_sort_rank: 5,
                nodeList: ['LX_005', 'S_PU_005', 'CO2_005', 'WV_S_005', 'T_S_005', 'RH_S_005'],
              },
              {
                target_code: '006',
                target_name: 'C',
                chart_color: '#a9e34b',
                chart_sort_rank: 6,
                nodeList: ['LX_006', 'CO2_006', 'WV_S_006', 'T_S_006', 'RH_S_006'],
              },
            ],
          },
        ],
      },
      {
        target_id: 'outside',
        target_name: '외부 환경',
        description:
          '농업 병행 태양광 부지와의 대조군으로 작물 생육에 들어간 센서와 기상환경 계측 센서 존재',
        defList: [
          {
            target_id: 'outside',
            target_prefix: 'OS',
            placeList: [
              {
                target_code: '007',
                chart_color: '#ffe066',
                chart_sort_rank: 7,
                nodeList: [
                  'LX_007',
                  'S_H_007',
                  'CO2_007',
                  'WV_S_007',
                  'T_S_007',
                  'RH_S_007',
                  'T_OA_007',
                  'RH_OA_007',
                  'W_D_007',
                  'W_S_007',
                  'RF1_007',
                  'IR_007',
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  controlInfo: {},
};

module.exports = map;