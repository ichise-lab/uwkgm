export const content = [
    {
        items: [
            {
                title: {
                    en: 'Home',
                    jp: 'ホーム'
                },
                icon: 'home',
                items: [
                    {
                        title: {
                            en: 'Dashboard',
                            jp: 'ダッシュボード'
                        },
                        link: '/console/home/dashboard'
                    }
                ]
            }
        ]
    },
    {
        items: [
            {
                title: {
                    en: 'Administrator',
                    jp: '管理者'
                },
                icon: 'settings_applications',
                restriction: 'admin',
                items: [
                    {
                        title: {
                            en: 'Control Panel',
                            jp: 'コントロールパネル'
                        },
                        locked: true
                    },
                    {
                        title: {
                            en: 'Servers',
                            jp: 'サーバ'
                        },
                        locked: true
                    },
                    {
                        title: {
                            en: 'Database',
                            jp: 'データベース'
                        },
                        locked: true
                    }
                ]
            },
            {
                title: {
                    en: 'Management',
                    jp: '管理'
                },
                icon: 'dns',
                items: [
                    {
                        title: {
                            en: 'Accounts',
                            jp: 'アカウント'
                        },
                        restriction: 'admin',
                        locked: true
                    },
                    {
                        title: {
                            en: 'Throttling',
                            jp: '調整'
                        },
                        restriction: 'admin',
                        locked: true
                    },
                    {
                        title: {
                            en: 'Modifiers',
                            jp: '修飾子'
                        },
                        link: '/console/mods'
                    }
                ]
            }
        ]
    },
    {
        items: [
            {
                title: {
                    en: 'API'
                },
                icon: 'cloud_circle',
                items: [
                    {
                        title: {
                            en: 'Explorer',
                            jp: 'エクスプローラー'
                        },
                        link: '/console/api/explorer'
                    },
                    {
                        title: {
                            en: 'Clients',
                            jp: 'クライアント'
                        },
                        locked: true
                    }
                ]
            },
            {
                title: {
                    en: 'Graphs',
                    jp: 'グラフ'
                },
                icon: 'share',
                items: [
                    {
                        title: {
                            en: 'Visualizer',
                            jp: '視覚化'
                        },
                        link: '/console/graphs/visualizer'
                    },
                    {
                        title: {
                            en: 'Query',
                            jp: '問い合わせ'
                        },
                        locked: true
                    }
                ]
            }
        ]
    },
    {
        items: [
            {
                title: {
                    en: 'Settings',
                    jp: '設定'
                },
                icon: 'settings',
                items: [
                    {
                        title: {
                            en: 'General',
                            jp: '一般'
                        },
                        locked: true
                    }
                ]
            }
        ]
    },
    {
        items: [
            {
                title: {
                    en: 'Account',
                    jp: 'アカウント'
                },
                icon: 'account_circle',
                items: [
                    {
                        title: {
                            en: 'Manage',
                            jp: '管理'
                        },
                        locked: true
                    },
                    {
                        title: {
                            en: 'Log out',
                            jp: 'ログアウト'
                        },
                        link: '/logout'
                    }
                ]
            }
        ]
    }
]