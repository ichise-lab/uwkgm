import React from 'react';

export const content = {
    organizations: {
        title: {
            en: () => (
                <React.Fragment>
                    Knowledge management<br />system for organizations
                </React.Fragment>
            ),
            jp: '組織のための知識管理システム'
        },
        description: {
            en: 'Aggregate organization’s complex data and build relations with massive knowledgebases such as DBpedia and Freebase to generate insights from a wider perspective',
            jp: '組織が持つ複雑なデータを集約し，DBpediaやFreebaseなどの大規模な知識ベースと接続して，より広い視野からデータを見ることができます．'
        }
    },
    researchers: {
        title: {
            en: () => (
                <React.Fragment>
                    Knowledge graph<br />infrastructure for researchers
                </React.Fragment>
            ),
            jp: '研究者のための知識グラフ基盤'
        },
        description: {
            en: 'Easily acquire, store, access, and expand a knowledge graph, as well as streamline a set of research procedures with research toolkit',
            jp: '知識グラフを簡単に取得，保存，アクセス，拡張することができると共に，研究ツールキットを利用して，研究に必要な手順を合理化できます．'
        },
    },
    users: {
        title: {
            en: () => (
                <React.Fragment>
                    Design for both<br />developers and end-users
                </React.Fragment>
            ),
            jp: '開発者とエンドユーザーの両方に向けた設計'
        },
        description: {
            en: 'Customize, scale, and extend UWKGM to fit your unique requirements, while also control who gets access to your data and tools',
            jp: '独自の要件に合わせて，UWKGMをカスタマイズして拡張できると同時に，データやツールにアクセスするユーザーを制御できます．'
        }
    }
}