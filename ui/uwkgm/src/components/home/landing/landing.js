import React from 'react';

import { Highlights } from './highlights/highlights';
import { Intro } from './intro/intro';

export function Landing() {
    return (
      <React.Fragment>
        <Intro />
        <Highlights />
      </React.Fragment>
    );
}
