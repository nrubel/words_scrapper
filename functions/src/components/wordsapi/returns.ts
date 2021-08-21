interface model {
    type: string,
    result: any,
}

const returnCurrentData: (data: model) => any = ({type, result}) =>
    type === 'everything'
        ? result
        : result.results
            .map((r: any) => r[type])
            .flat(100)
            .filter((e: string) => !!e)

export default returnCurrentData