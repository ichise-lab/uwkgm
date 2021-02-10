import React from 'react';

import { content } from './options.content';
import { Language } from 'services/languages/languages';
import { OptionClass } from 'components/console/templates/options';
import { 
    Section,
    SelectBlock,
    SliderBlock,
    SubHeader,
    SwitchBlock
} from 'components/console/templates/options';

export class Options extends OptionClass {
    constructor(props) {
        super(props);

        this.nSections = 1;
        var opens = [true]
        
        this.state = {opens: opens};
    }

    render() {
        return (
            <OptionsFunc 
                isOpens={this.state.opens} 
                onSectionToggle={this.handleSectionToggle}
            />
        );
    }
}

const OptionsFunc = props => {
    const { 
        isOpens,
        onSectionToggle
    } = props;

    return (
        <React.Fragment>
            <Section
                title={<Language text={content.display} />}
                isOpen={isOpens[0]}
                isFoldable={true}
                onToggle={(event) => {onSectionToggle(0)}}
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
