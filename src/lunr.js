import lunr from 'lunr'
import stemmer from 'lunr-languages/lunr.stemmer.support'
// FIXME remove hardcoded es
// import config from '../config.json'
import es from 'lunr-languages/lunr.es'

stemmer(lunr)
es(lunr)

export default lunr
