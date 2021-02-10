import React from 'react';

import { content } from './options.content';
import { Language } from 'services/languages/languages';
import { 
    Section,
    SelectBlock,
    SliderBlock,
    SubHeader,
    SwitchBlock
} from 'components/console/templates/options';

export class Options extends React.Component {
    constructor(props) {
        super(props);

        this.nSections = 1;

        var opens = [];
        for (var i = 0; i < this.nSections; i++) {
            opens.push(true);
        }

        this.state = {opens: opens};
    }
}