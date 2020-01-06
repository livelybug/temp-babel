import {pageUrls, requestUrls} from '../util/env';
import {UrlTest} from '../util/constants';
import {i18n} from '../plugins/i18n';

export default [
  {
    title: i18n.t('adminUser'),
    icon: 'style',
    hash: 'style-and-identity',
    features: [
      {
        title: i18n.t('userManagement'),
        icon: 'people',
        hash: pageUrls.adminManage
        // urlTest: [new UrlTest(requestUrls.admins, 'get')]
      },
      {
        title: i18n.t('addAdmin'),
        icon: 'person_add',
        hash: pageUrls.addAdmin
      }
    ]
  },
  {
    title: i18n.t('commonUser'),
    icon: 'layers',
    hash: 'css-helpers',
    features: [
      {
        title: i18n.t('userManagement'),
        icon: 'people_outline',
        hash: pageUrls.commonManage,
        iframeTabs: false,
        tabs: [
          {
            title: 'Row',
            label: 'Row',
            icon: 'web',
            hash: 'flex-row'
          },
          {
            title: 'Column',
            label: 'Column',
            icon: 'web',
            hash: 'flex-column'
          },
          {
            title: 'Gutter',
            label: 'Gutter',
            icon: 'web',
            hash: 'flex-gutter'
          }
        ]
      },
      {
        title: i18n.t('addCommonUser'),
        icon: 'person_add',
        hash: pageUrls.addCommon
      },
    ]
  },
  {
    title: i18n.t('adminGroup'),
    icon: 'dashboard',
    hash: 'layout-demo',
    extract: true,
    features: [
      {
        title: i18n.t('groupManage'),
        icon: 'view_array',
        hash: pageUrls.groupManage,
      },
      {
        title: i18n.t('addGroup'),
        icon: 'library_add',
        hash: pageUrls.addGroup,
      }
    ]
  },
  {
    title: i18n.t('deviceGrouping'),
    icon: 'panorama_wide_angle',
    hash: 'buttons',
    features: [
      {
        title: i18n.t('deviceManage'),
        icon: 'router',
        hash: pageUrls.deviceManage,
      },
      {
        title: i18n.t('addDevice'),
        icon: 'add_to_queue',
        hash: pageUrls.addDevice,
      },
      {
        title: i18n.t('addDevices'),
        icon: 'playlist_add',
        hash: pageUrls.addDevices
      },
      {
        title: i18n.t('deviceActivations'),
        icon: 'build',
        hash: pageUrls.deviceActivations
      },
      {
        title: i18n.t('uploadReport'),
        icon: 'list_alt',
        hash: pageUrls.uploadReport
      },
    ]
  },
  {
    title: i18n.t('adminProject'),
    icon: 'rowing',
    hash: 'navigation',
    features: [
      {
        title: i18n.t('projectManage'),
        icon: 'view_day',
        hash: pageUrls.projectManage,
      },
      {
        title: i18n.t('addProject'),
        icon: 'note_add',
        hash: pageUrls.addProject,
      }
    ]
  },
  {
    title: i18n.t('adminProduct'),
    icon: 'assignment',
    hash: 'forms',
    features: [
      {
        title: i18n.t('productManage'),
        icon: 'event_note',
        hash: pageUrls.productManage,
      },
      {
        title: i18n.t('addProduct'),
        icon: 'add_photo_alternate',
        hash: pageUrls.addProduct,
      }
    ]
  },
  {
    title: i18n.t('adminHoliday'),
    icon: 'assignment',
    hash: 'forms',
    features: [
      {
        title: i18n.t('holidayManage'),
        icon: 'date_range',
        hash: pageUrls.holidayManage,
      },
      {
        title: i18n.t('addHolidays'),
        icon: 'add_alert',
        hash: pageUrls.addHolidays,
      }
    ]
  },
  {
    title: i18n.t('errorState'),
    icon: 'style',
    hash: 'style-and-identity',
    features: [
      {
        title: i18n.t('stateManagement'),
        icon: 'device_unknown',
        hash: pageUrls.errorStatusManage
      },
      {
        title: i18n.t('addStatus'),
        icon: 'add_box',
        hash: pageUrls.addStatus
      }
    ]
  }
]
