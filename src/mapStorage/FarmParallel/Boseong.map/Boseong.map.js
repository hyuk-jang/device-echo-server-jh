const { di } = require('../../../module');

const {
  dcmConfigModel: {
    nodeDataType: { BLOCK, TROUBLE, NONE },
  },
} = di;

/**
 * @type {mDeviceMap}
 */
const map = {
  drawInfo: {
    frame: {
      mapInfo: {
        width: 2000,
        height: 1230,
        backgroundInfo: { backgroundData: '', backgroundPosition: [0, 0] },
      },
      svgModelResourceList: [
        {
          id: 'farmParallelSite',
          type: 'rect',
          elementDrawInfo: { width: 250, height: 350, color: 'red', opacity: 0.5 },
          textStyleInfo: { color: 'white' },
        },
        {
          id: 'outside',
          type: 'rect',
          elementDrawInfo: { width: 700, height: 200, color: '#009432', opacity: 0.5 },
          textStyleInfo: { color: 'white' },
        },
        {
          id: 'inverter',
          type: 'rect',
          elementDrawInfo: { width: 100, height: 100, color: '#0652DD', opacity: 0.5 },
          textStyleInfo: { color: 'white' },
        },
        {
          id: 'sensor',
          type: 'rect',
          elementDrawInfo: { width: 100, height: 30, color: '#f0f0f0' },
        },
      ],
    },
    positionInfo: {
      svgPlaceList: [
        {
          placeId: 'farmParallelSite',
          defList: [
            { id: 'PV_N_062', name: '좌측_062', resourceId: 'farmParallelSite', point: [300, 100] },
            { id: 'PV_N_061', name: '중앙_061', resourceId: 'farmParallelSite', point: [600, 100] },
            { id: 'PV_N_010', name: '우측_010', resourceId: 'farmParallelSite', point: [900, 100] },
          ],
        },
        {
          placeId: 'outside',
          defList: [
            { id: 'OS_011', name: '외기 환경_011', resourceId: 'outside', point: [400, 600] },
          ],
        },
        {
          placeId: 'inverter',
          defList: [
            { id: 'IVT_A', name: '인버터_A', resourceId: 'inverter', point: [800, 470] },
            { id: 'IVT_B', name: '인버터_B', resourceId: 'inverter', point: [550, 470] },
          ],
        },
      ],
      svgNodeList: [
        {
          nodeDefId: 'co2',
          is_sensor: 1,
          defList: [
            {
              id: 'CO2_010',
              name: '이산화탄소_010',
              placeId: 'PV_N_010',
              resourceId: 'sensor',
              point: [975, 134],
            },
          ],
        },
        {
          nodeDefId: 'lux',
          is_sensor: 1,
          defList: [
            {
              id: 'LX_010',
              name: '조도_010',
              placeId: 'PV_N_010',
              resourceId: 'sensor',
              point: [975, 224],
            },
          ],
        },
        {
          nodeDefId: 'soilReh',
          is_sensor: 1,
          defList: [
            {
              id: 'RH_S_010',
              name: '토양 습도_010',
              placeId: 'PV_N_010',
              resourceId: 'sensor',
              point: [975, 179],
            },
          ],
        },
        {
          nodeDefId: 'pvUnderlyingSolar',
          is_sensor: 1,
          defList: [
            {
              id: 'S_PU_010',
              name: '모듈 하부 일사량_010',
              placeId: 'PV_N_010',
              resourceId: 'sensor',
              point: [975, 341],
            },
          ],
        },
        {
          nodeDefId: 'soilTemperature',
          is_sensor: 1,
          defList: [
            {
              id: 'T_S_010',
              name: '토양 온도_010',
              placeId: 'PV_N_010',
              resourceId: 'sensor',
              point: [975, 296],
            },
          ],
        },
        {
          nodeDefId: 'soilWaterValue',
          is_sensor: 1,
          defList: [
            {
              id: 'WV_S_010',
              name: '토양 EC 값_010',
              placeId: 'PV_N_010',
              resourceId: 'sensor',
              point: [975, 386],
            },
          ],
        },
        {
          nodeDefId: 'outsideAirReh',
          is_sensor: 1,
          defList: [
            {
              id: 'RH_OA_061',
              name: '외기 습도_061',
              placeId: 'PV_N_061',
              resourceId: 'sensor',
              point: [675, 134],
            },
          ],
        },
        {
          nodeDefId: 'pvUnderlyingSolar',
          is_sensor: 1,
          defList: [
            {
              id: 'S_PU_061',
              name: '모듈 하부 일사량_061',
              placeId: 'PV_N_061',
              resourceId: 'sensor',
              point: [675, 224],
            },
          ],
        },
        {
          nodeDefId: 'outsideAirTemperature',
          is_sensor: 1,
          defList: [
            {
              id: 'T_OA_061',
              name: '외기 온도_061',
              placeId: 'PV_N_061',
              resourceId: 'sensor',
              point: [675, 179],
            },
          ],
        },
        {
          nodeDefId: 'windDirection',
          is_sensor: 1,
          defList: [
            {
              id: 'W_D_061',
              name: '풍향_061',
              placeId: 'PV_N_061',
              resourceId: 'sensor',
              point: [675, 341],
            },
          ],
        },
        {
          nodeDefId: 'windSpeed',
          is_sensor: 1,
          defList: [
            {
              id: 'W_S_061',
              name: '풍속_061',
              placeId: 'PV_N_061',
              resourceId: 'sensor',
              point: [675, 296],
            },
          ],
        },
        {
          nodeDefId: 'pvUnderlyingSolar',
          is_sensor: 1,
          defList: [
            {
              id: 'S_PU_062',
              name: '모듈 하부 일사량_062',
              placeId: 'PV_N_062',
              resourceId: 'sensor',
              point: [375, 185],
            },
          ],
        },
        {
          nodeDefId: 'pvUnderlyingSolar',
          is_sensor: 1,
          defList: [
            {
              id: 'S_PU_063',
              name: '모듈 하부 일사량_063',
              placeId: 'PV_N_062',
              resourceId: 'sensor',
              point: [375, 230],
            },
          ],
        },
        {
          nodeDefId: 'co2',
          is_sensor: 1,
          defList: [
            {
              id: 'CO2_011',
              name: '이산화탄소_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [480, 655],
            },
          ],
        },
        {
          nodeDefId: 'lux',
          is_sensor: 1,
          defList: [
            {
              id: 'LX_011',
              name: '조도_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [630, 655],
            },
          ],
        },
        {
          nodeDefId: 'r1',
          is_sensor: 1,
          defList: [
            {
              id: 'RF1_011',
              name: '시간당 강우량_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [770, 655],
            },
          ],
        },
        {
          nodeDefId: 'outsideAirReh',
          is_sensor: 1,
          defList: [
            {
              id: 'RH_OA_011',
              name: '외기 습도_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [920, 655],
            },
          ],
        },
        {
          nodeDefId: 'soilReh',
          is_sensor: 1,
          defList: [
            {
              id: 'RH_S_011',
              name: '토양 습도_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [480, 691],
            },
          ],
        },
        {
          nodeDefId: 'horizontalSolar',
          is_sensor: 1,
          defList: [
            {
              id: 'S_H_011',
              name: '수평 일사량_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [920, 691],
            },
          ],
        },
        {
          nodeDefId: 'outsideAirTemperature',
          is_sensor: 1,
          defList: [
            {
              id: 'T_OA_011',
              name: '외기 온도_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [480, 727],
            },
          ],
        },
        {
          nodeDefId: 'soilTemperature',
          is_sensor: 1,
          defList: [
            {
              id: 'T_S_011',
              name: '토양 온도_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [920, 727],
            },
          ],
        },
        {
          nodeDefId: 'soilWaterValue',
          is_sensor: 1,
          defList: [
            {
              id: 'WV_S_011',
              name: '토양 EC 값_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [590, 727],
            },
          ],
        },
        {
          nodeDefId: 'windDirection',
          is_sensor: 1,
          defList: [
            {
              id: 'W_D_011',
              name: '풍향_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [700, 727],
            },
          ],
        },
        {
          nodeDefId: 'windSpeed',
          is_sensor: 1,
          defList: [
            {
              id: 'W_S_011',
              name: '풍속_011',
              placeId: 'OS_011',
              resourceId: 'sensor',
              point: [810, 727],
            },
          ],
        },
      ],
    },
  },
  setInfo: {
    mainInfo: { uuid: '003' },
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
          cmdExecTimeoutMs: 2000,
        },
      },
      {
        dpcId: 'DPC_IVT_001',
        protocol_info: {
          mainCategory: 'Inverter',
          subCategory: 'das_1.3',
          wrapperCategory: 'default',
          cmdExecTimeoutMs: 6000,
        },
      },
      {
        dpcId: 'DPC_IVT_002',
        protocol_info: {
          mainCategory: 'Inverter',
          subCategory: 's5500k',
          wrapperCategory: 'default',
          cmdExecTimeoutMs: 10000,
        },
      },
    ],
    repeatNodeList: [
      {
        repeatId: 'RE_NODE_IVT',
        repeatCategory: 'node',
        nodeList: [
          { target_code: '006', target_name: 'A' },
          { target_code: '007', target_name: 'B' },
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
            serial_number: 10,
            target_code: '010',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: ['LX_010', 'S_PU_010', 'CO2_010', 'WV_S_010', 'T_S_010', 'RH_S_010'],
          },
          {
            serial_number: 61,
            target_code: '061',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: ['W_S_061', 'W_D_061', 'T_OA_061', 'RH_OA_061', 'S_PU_061'],
          },
          {
            serial_number: 62,
            target_code: '062',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: ['S_PU_062', 'S_PU_063'],
          },
        ],
      },
      {
        target_prefix: 'D_OE',
        target_name: 'Outside Environment (외기 환경)',
        dataLoggerDeviceList: [
          {
            serial_number: 11,
            target_code: '011',
            dccId: 'DCC_001',
            dpcId: 'DPC_001',
            nodeList: [
              'LX_011',
              'S_H_011',
              'CO2_011',
              'WV_S_011',
              'T_S_011',
              'RH_S_011',
              'T_OA_011',
              'RH_OA_011',
              'W_D_011',
              'W_S_011',
              'RF1_011',
              'IR_011',
            ],
          },
        ],
      },
      {
        target_prefix: 'D_IVT',
        target_name: '인버터 DL',
        dataLoggerDeviceList: [
          {
            target_name: '보성 A (5.5kW 급)',
            serial_number: { type: 'Buffer', data: [16] },
            target_code: '006',
            dccId: 'DCC_001',
            dpcId: 'DPC_IVT_002',
            repeatId: 'RE_PREFIX_IVT',
          },
          {
            target_name: '보성 B (5.5kW 급)',
            serial_number: { type: 'Buffer', data: [17] },
            target_code: '007',
            dccId: 'DCC_001',
            dpcId: 'DPC_IVT_002',
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
        data_unit: '℃',
        description: '섭씨: 1 atm에서의 물의 어는점을 0도, 끓는점을 100도로 정한 온도',
        defList: [
          {
            target_id: 'soilTemperature',
            target_prefix: 'T_S',
            target_name: '토양 온도',
            nodeList: [
              { target_code: '010', axisScale: [0, 0], moveScale: [0, 0] },
              { target_code: '011', axisScale: [0, 0], moveScale: [0.7, 0.9] },
            ],
          },
          {
            target_id: 'outsideAirTemperature',
            target_prefix: 'T_OA',
            target_name: '외기 온도',
            nodeList: [
              { target_code: '011', axisScale: [0, 0], moveScale: [-0.7, 0.9] },
              { target_code: '061', axisScale: [0, 0], moveScale: [-1.2, -1.5] },
            ],
          },
        ],
      },
      {
        target_id: 'reh',
        target_name: '습도',
        is_sensor: 1,
        data_unit: '%RH',
        description: '공기 중에 포함되어 있는 수증기의 양 또는 비율을 나타내는 단위',
        defList: [
          {
            target_id: 'soilReh',
            target_prefix: 'RH_S',
            target_name: '토양 습도',
            nodeList: [
              { target_code: '010', axisScale: [0, 0], moveScale: [-1.2, -1.5] },
              { target_code: '011', axisScale: [0, 0], moveScale: [-0.7, 0.7] },
            ],
          },
          {
            target_id: 'outsideAirReh',
            target_prefix: 'RH_OA',
            target_name: '외기 습도',
            nodeList: [
              { target_code: '011', axisScale: [0, 0], moveScale: [0.7, 0] },
              { target_code: '061', axisScale: [0, 0], moveScale: [1.2, -3] },
            ],
          },
        ],
      },
      {
        target_id: 'ws',
        target_name: '풍속',
        is_sensor: 1,
        data_unit: 'm/s',
        description: '초당 바람이 이동하는 거리(m)',
        defList: [
          {
            target_id: 'windSpeed',
            target_prefix: 'W_S',
            target_name: '풍속',
            nodeList: [
              { target_code: '011', axisScale: [0, 0], moveScale: [0.4, 0.4] },
              { target_code: '061', axisScale: [0, 0], moveScale: [0, 0] },
            ],
          },
        ],
      },
      {
        target_id: 'wd',
        target_name: '풍향',
        is_sensor: 1,
        description: '풍향 0~7 (북, 북동, 동, 남동, 남, 남서, 서, 북서)',
        defList: [
          {
            target_id: 'windDirection',
            target_prefix: 'W_D',
            target_name: '풍향',
            nodeList: [
              { target_code: '011', axisScale: [0, 0], moveScale: [0.7, 0.4] },
              { target_code: '061', axisScale: [0, 0], moveScale: [1.2, 2.7] },
            ],
          },
        ],
      },
      {
        target_id: 'solar',
        target_name: '일사량',
        is_sensor: 1,
        data_unit: 'W/m²',
        description: '1평방 미터당 조사되는 일사에너지의 양이 1W',
        defList: [
          {
            target_id: 'horizontalSolar',
            target_name: '수평 일사량',
            target_prefix: 'S_H',
            nodeList: [{ target_code: '011', axisScale: [0, 0], moveScale: [0.7, 0.7] }],
          },
          {
            target_id: 'inclinedSolar',
            target_name: '경사 일사량',
            target_prefix: 'S_I',
            nodeList: [],
          },
          {
            target_id: 'pvUnderlyingSolar',
            target_name: '모듈 하부 일사량',
            target_prefix: 'S_PU',
            nodeList: [
              { target_code: '010', axisScale: [0, 0], moveScale: [1.2, 2.7] },
              {
                target_code: '061',
                target_name: 'A',
                data_logger_index: 1,
                axisScale: [0, 0],
                moveScale: [0, 0],
              },
              {
                target_code: '062',
                target_name: 'B',
                data_logger_index: 1,
                axisScale: [0, 0],
                moveScale: [1, -1.5],
              },
              {
                target_code: '063',
                target_name: 'C',
                data_logger_index: 2,
                axisScale: [0, 0],
                moveScale: [-1, 0],
              },
            ],
          },
        ],
      },
      {
        target_id: 'rainfall',
        target_name: '강우량',
        is_sensor: 1,
        data_unit: 'mm/hr',
        description: '시간당 일정한 곳에 내린 비의 분량. 단위는 mm',
        defList: [
          {
            target_id: 'r1',
            target_prefix: 'RF1',
            target_name: '시간당 강우량',
            nodeList: [{ target_code: '011', axisScale: [0, 0], moveScale: [0, 0] }],
          },
        ],
      },
      {
        target_id: 'isRain',
        target_name: '강우 감지 여부',
        is_sensor: 1,
        data_unit: null,
        description: '감지시 1, 미감지시 0',
        defList: [
          {
            target_id: 'isRain',
            target_prefix: 'I_R',
            target_name: '강우 감지 여부',
            nodeList: [{ target_code: '011', axisScale: [0, 0], moveScale: [0, 0] }],
          },
        ],
      },
      {
        target_id: 'co2',
        target_name: '이산화탄소',
        is_sensor: 1,
        data_unit: 'ppm',
        description: '백만분의 1. 이산화탄소 농도 395ppm = 395/1,000,000 * 100 = 0.0395 %',
        defList: [
          {
            target_id: 'co2',
            target_prefix: 'CO2',
            target_name: '이산화탄소',
            nodeList: [
              { target_code: '010', axisScale: [0, 0], moveScale: [1.2, -3] },
              { target_code: '011', axisScale: [0, 0], moveScale: [-0.7, 0] },
            ],
          },
        ],
      },
      {
        target_id: 'uv',
        target_name: '자외선',
        is_sensor: 1,
        data_unit: 'mJ/c㎡',
        description: '1평방 센치당 조사되는 uv 에너지가 1mJ',
        defList: [],
      },
      {
        target_id: 'lux',
        target_name: '조도',
        is_sensor: 1,
        data_unit: 'lx',
        description: '1㎡의 면적 위에 1m의 광속이 균일하게 비춰질 때',
        defList: [
          {
            target_id: 'lux',
            target_prefix: 'LX',
            target_name: '조도',
            nodeList: [
              { target_code: '010', axisScale: [0, 0], moveScale: [0, 0] },
              { target_code: '011', axisScale: [0, 0], moveScale: [0, 0] },
            ],
          },
        ],
      },
      {
        target_id: 'waterValue',
        target_name: 'EC 값',
        is_sensor: 1,
        data_unit: '%',
        description: '',
        defList: [
          {
            target_id: 'soilWaterValue',
            target_prefix: 'WV_S',
            target_name: '토양 EC 값',
            nodeList: [
              { target_code: '010', axisScale: [0, 0], moveScale: [1.2, 3] },
              { target_code: '011', axisScale: [0, 0], moveScale: [0.4, 0.4] },
            ],
          },
        ],
      },
      {
        target_id: 'vol',
        target_name: '전압',
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
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
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
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
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
        data_unit: 'W',
        description: '1 와트(기호 W)는 1 초 동안의 1 줄(N·m)에 해당하는 일률의 SI 단위',
        defList: [],
      },
      {
        target_id: 'kW',
        target_name: '전력량',
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
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
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
        data_unit: 'MW',
        description:
          '1 메가와트(기호 MW)는 1 초 동안의 1,000,000 줄(N·m)에 해당하는 일률의 SI 단위',
        defList: [],
      },
      {
        target_id: 'Wh',
        target_name: '전력량',
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
        data_unit: 'Wh',
        description: '시간당 에너지 단위, 1 W의 일률로 1 시간 동안 하는 일의 양',
        defList: [],
      },
      {
        target_id: 'kWh',
        target_name: '전력량',
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
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
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
        data_unit: 'MWh',
        description: '시간당 에너지 단위, 1 MW의 일률로 1 시간 동안 하는 일의 양',
        defList: [],
      },
      {
        target_id: 'powerFactor',
        target_name: '역률',
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
        data_unit: '%',
        defList: [],
      },
      {
        target_id: 'frequency',
        target_name: '주파수',
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'block',
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
        is_sensor: 2,
        is_submit_api: 0,
        save_db_type: 'trouble',
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
                target_code: '006',
                target_name: '보성 A (5.5kW 급)',
                chart_color: '#2b8a3e',
                chart_sort_rank: 6,
                repeatId: 'RE_PREFIX_IVT',
                nodeList: [],
              },
              {
                target_code: '007',
                target_name: '보성 B (5.5kW 급)',
                chart_color: '#ff6b6b',
                chart_sort_rank: 7,
                repeatId: 'RE_PREFIX_IVT',
                nodeList: [],
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
            target_id: 'normalPV',
            target_prefix: 'PV_N',
            target_name: '태양광',
            placeList: [
              {
                target_code: '010',
                target_name: '하부',
                chart_color: '#2b8a3e',
                chart_sort_rank: 10,
                nodeList: ['CO2_010', 'LX_010', 'RH_S_010', 'S_PU_010', 'T_S_010', 'WV_S_010'],
              },
              {
                target_code: '061',
                nodeList: ['RH_OA_061', 'S_PU_061', 'T_OA_061', 'W_D_061', 'W_S_061'],
                depth: 0,
              },
              { target_code: '062', nodeList: ['S_PU_062', 'S_PU_063'], depth: 0 },
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
                target_code: '011',
                chart_color: '#ff6b6b',
                chart_sort_rank: 11,
                nodeList: [
                  'CO2_011',
                  'I_R_911',
                  'LX_011',
                  'RF1_011',
                  'RH_OA_011',
                  'RH_S_011',
                  'S_H_011',
                  'T_OA_011',
                  'T_S_011',
                  'WV_S_011',
                  'W_D_011',
                  'W_S_011',
                ],
              },
            ],
          },
        ],
      },
    ],
    svgResourceConnectionList: [
      {
        targetIdList: ['PV_N_062', '\bPV_N_061', 'PV_N_010'],
        resourceIdList: ['farmParallelSite'],
      },
      {
        targetIdList: [
          'S_PU_063',
          'S_PU_062',
          'RH_OA_061',
          'S_PU_061',
          'T_OA_061',
          'W_D_061',
          'W_S_061',
          'CO2_010',
          'LX_010',
          'RH_S_010',
          'S_PU_010',
          'T_S_010',
          'WV_S_010',
          'CO2_011',
          'I_R_011',
          'LX_011',
          'RF1_011',
          'RH_OA_011',
          'RH_S_011',
          'S_H_011',
          'T_OA_011',
          'T_S_011',
          'WV_S_011',
          'W_D_011',
          'W_S_011',
        ],
        resourceIdList: ['sensor'],
      },
    ],
  },
  controlInfo: {},
};

module.exports = map;
