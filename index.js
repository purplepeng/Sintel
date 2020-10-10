const preprocessor = require('./src/preprocess/index')
const generator = require('./src/generate/index')

const folderPath = '/Users/sunpeng/documents/seeking_odds/Doc-Protocol/v2'
preprocessor.preprocess(folderPath)
// generator.write('/Users/sunpeng/documents/seeking_odds/Doc-Protocol/v2/index.json', 'json')
// generator.write(preprocessor.mergedObj, '/Users/sunpeng/documents/seeking_odds/Doc-Protocol/v2/index.md', 'md')
generator.writeSeparated(preprocessor.indexObj, preprocessor.mergedObj, 'md')


