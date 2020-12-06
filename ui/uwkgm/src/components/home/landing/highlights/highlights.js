import React from 'react';

import { content } from './highlights.content';
import { getStyles } from 'styles/styles';
import { Language } from 'services/languages/languages';
import { styles} from './highlights.css';

import devImg from 'assets/images/landing/dev.png';
import orgImg from 'assets/images/landing/org.png';
import scienceImg from 'assets/images/landing/science.png';

export function Highlights() {
    const classes = getStyles(styles.highlights);

    return (
        <section className={classes.section}>
            <div className={classes.block}>
                <img src={orgImg} alt="Organizations" />
                <h4>
                    <Language text={content.organizations.title} />
                </h4>
                <p>
                    <Language text={content.organizations.description} />
                </p>
            </div>
            <div className={classes.block}>
                <img src={scienceImg} alt="Researchers" />
                <h4>
                    <Language text={content.researchers.title} />
                </h4>
                <p>
                    <Language text={content.researchers.description} />
                </p>
            </div>
            <div className={classes.block}>
                <img src={devImg} alt="Developers" />
                <h4>
                    <Language text={content.users.title} />
                </h4>
                <p>
                    <Language text={content.users.description} />
                </p>
            </div>
        </section>
    );
}