import React from 'react';

import chai from 'chai';
import sinonChai from 'sinon-chai';
import dirtyChai from 'dirty-chai';

import installTestStubs from '../src/installTestStubs';

// dirtyChai needs to be loaded before other plugins
chai.use(dirtyChai);
chai.use(sinonChai);

// frint expects React to be in global
global.React = React;

// call createTestStubs only in the end
installTestStubs();
