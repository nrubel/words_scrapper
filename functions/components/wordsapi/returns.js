const getCurrentData = ({type, result}) => type === 'everything' ? result : result.results.map(r => r[type]).flat(100).filter(e => !!e)

module.exports = {
  getCurrentData,
}