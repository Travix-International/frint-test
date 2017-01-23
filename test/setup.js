import chai from 'chai';
import sinonChai from 'sinon-chai';
import dirtyChai from 'dirty-chai';

import installTestStubs from '../src/installTestStubs';

// dirtyChai needs to be loaded before other plugins
chai.use(dirtyChai);
chai.use(sinonChai);

// call createTestStubs only in the end
installTestStubs();
