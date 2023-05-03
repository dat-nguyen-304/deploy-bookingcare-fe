export const adminMenu = [
    {
        name: 'menu.admin.manage-account', menus: [
            // {
            //     name: 'menu.admin.crud', link: '/system/manage-user',
            //     subMenus: [
            //         { name: 'menu.system.system-administrator.user-manage', },
            //         { name: 'menu.system.system-administrator.user-redux-manage', link: '/system/user-redux-manage' },
            //     ]
            // },
            {
                name: 'menu.admin.manage-account', link: '/system/manage-user'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            }
        ]
    },
    {
        name: 'menu.admin.manage-schedule', menus: [
            { name: 'menu.admin.manage-schedule', link: '/system/manage-schedule' }
        ]
    },
    {
        name: 'menu.admin.manage-specialty', menus: [
            { name: 'menu.admin.add-specialty', link: '/system/add-specialty' },
            { name: 'menu.admin.update-specialty', link: '/system/update-specialty' }
        ]
    },
];

export const doctorMenu = [
    {
        name: 'menu.doctor.menu', menus: [
            { name: 'menu.doctor.my-schedule', link: '/doctor/manage-schedule' },
            { name: 'menu.doctor.my-information', link: '/doctor/info' }
        ]
    },

];