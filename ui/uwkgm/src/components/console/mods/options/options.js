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

        this.nSections = 2;

        var opens = [];
        for (var i = 0; i < this.nSections; i++) {
            opens.push(true);
        }

        this.state = {opens: opens};
    }

    handleToggle = (index) => {
        var opens = this.state.opens;
        opens[index] = !opens[index];
        this.setState(() => ({opens: opens}));
    }

    render() {
        return (
            <OptionsFunc 
                isOpens={this.state.opens} 
                onToggle={this.handleToggle}
            />
        );
    }
}

const OptionsFunc = (props) => {
    const { 
        isOpens,
        onToggle
    } = props;

    return (
        <React.Fragment>
            <Section
                title={<Language text={content.display} />}
                isOpen={isOpens[0]}
                isFoldable={true}
                onToggle={(event) => {onToggle(0)}}
            >
                <SelectBlock
                    label={<Language text={content.sortBy} />}
                    options={[{title: 'Issued time', value: 'time'}]}
                    value={'time'}
                />
                <SelectBlock
                    label={<Language text={content.issuers} />}
                    options={[{title: 'All', value: 'all'}]}
                    value={'all'}
                />
                <SliderBlock
                    label={<Language text={content.triplesPerPage} />}
                    value={20}
                    min={10}
                    max={100}
                    step={10}
                    disabled
                />
                <SubHeader title={<Language text={content.data} />} />
                <SwitchBlock 
                    label={<Language text={content.autoUpdate} />}
                    value="auto"
                    checked={true}
                    disabled
                />
            </Section>
        </React.Fragment>
    );
}
