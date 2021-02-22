import React from 'react';
import { Link } from "react-router-dom";

import { publicURL } from 'services/servers';

export const content = {
    uwkgm: {
        en: 'UWKGM'
    },
    motto: {
        en: () => (
            <React.Fragment>
                Knowledge Graphs
                <br />
                Intelligently Built
            </React.Fragment>
        ),
        jp: () => (
            <React.Fragment>
                知識グラフを
                <br />
                知的に構築
            </React.Fragment>
        )
    },
    description: {
        en: 'Leverage the power of constantly growing knowledge graphs through RESTful API and cutting-edge graph management tools',
        jp: 'RESTful APIと最先端のグラフ管理ツールにより，絶えず進化する知識グラフの能力を活用可能'
    },
    getStarted: {
        en: 'Get Started',
        jp: '始めましょう'
    },
    liveDemo: {
        en: 'Live Demo',
        jp: 'ライブデモ'
    },
    alternative: {
        en: () => (
            <React.Fragment>
                Or <Link to={`${publicURL}/console`}>log in</Link> if you already have an account
            </React.Fragment>
        ),
        jp: () => (
            <React.Fragment>
                すでにアカウントをお持ちの場合には，<Link to="/console">ログイン</Link>してください
            </React.Fragment>
        )
    }
}