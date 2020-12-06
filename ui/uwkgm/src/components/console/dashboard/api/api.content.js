import React from 'react';

export const content = {
    server: {
        title: {
            en: 'SERVER',
            jp: 'サーバ'
        },
        healthy: {
            en: 'HEALTHY',
            jp: '稼働中'
        },
        endpoint: {
            en: 'API Endpoint',
            jp: 'APIエンドポイント'
        },
        description: {
            en: 'Use the following URI to connect to UWKGM resource servers:',
            jp: '次のURIを使用して，UWKGMに接続します'
        },
        root: {
            en: 'API Root Endpoint',
            jp: 'APIルートエンドポイント'
        }
    },
    throttle: {
        title: {
            en: 'RATE LIMITS',
            jp: '制限到達'
        },
        base: {
            en: 'Base Limit',
            jp: '基本制限到達'
        },
        boost: {
            en: 'Current Boost',
            jp: '電流ブースト'
        },
        unit: {
            en: 'Requests/min',
            jp: 'リクエスト/分'
        }
    },
    spotlights: {
        title: {
            en: 'SPOTLIGHTS',
            jp: 'スポットライト'
        },
        works: {
            en: '0.2-alpha\'s work in progress',
        }
    },
    auth: {
        title: {
            en: 'AUTHORIZATION',
            jp: '認証'
        },
        refresh: {
            en: 'REFRESH',
            jp: '再読み込み'
        },
        description: {
            en: () => (
                <React.Fragment>
                    Requests to UWKGM server must contain authorization header with <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization" target="blank">'Bearer' keyword</a>
                </React.Fragment>
            ),
            jp: () => (
                <React.Fragment>
                    UWKGMサーバーへのリクエストには，<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization" target="blank">「Bearer」キーワード</a>付きの認証ヘッダーが含まれている必要があります
                </React.Fragment>
            )
        },
        accessToken: {
            en: 'Access Token',
            jp: 'アクセストークン'
        },
        refreshToken: {
            en: 'Refresh Token',
            jp: '更新トークン'
        },
        expires: {
            en: 'Expires:',
            jp: '期限切れ:'
        }
    }
}

export const mockProgress = [
    {
        text: {
            en: 'Deployment for public access',
        },
        status: 'finished'
    },
    {
        text: {
            en: 'Live demo',
        },
        status: 'finished'
    },
    {
        text: {
            en: 'Visualizer\'s graph editing features',
            jp: 'トリプル管理システムを構築する'
        },
        status: 'working'
    },
    {
        text: {
            en: 'Recommendation system based on entity embeddings'
        },
        status: 'working'
    },
    {
        text: {
            en: 'Version 2.0 documentation'
        },
        status: 'pending'
    }
]
