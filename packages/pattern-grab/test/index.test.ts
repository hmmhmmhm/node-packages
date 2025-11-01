import patternGrab, { getPositions } from '../src/index'

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris quam mauris, tempor sit amet porta sed, fermentum eu tellus. Cras ac quam felis. Ut ac fringilla arcu, et dignissim neque. Cras imperdiet sed diam sagittis vehicula. Duis eu efficitur est. Cras accumsan nulla non risus sodales accumsan. Donec magna magna, hendrerit vel neque a, volutpat molestie risus. Donec posuere sagittis mauris. Curabitur tempus tempor finibus. Aenean auctor mollis magna ut cursus. Vivamus ac velit turpis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam a gravida urna, a facilisis neque. Donec aliquet feugiat interdum. Ut risus eros, sodales et interdum vel, cursus sed lacus. Pellentesque suscipit arcu et sollicitudin convallis.
Phasellus porttitor nisi vitae nisi tempor, quis placerat est egestas. Integer mattis dapibus eros. Aenean a nisi auctor, ullamcorper felis quis, varius lacus. Cras quis blandit lorem. Integer malesuada arcu id sapien ultricies, ut volutpat ipsum pretium. Fusce et ornare dui. Fusce eu accumsan nisi, quis sollicitudin urna. Duis pretium, sapien non sagittis interdum, arcu eros maximus dui, sed condimentum lectus dolor scelerisque eros. Phasellus et risus in urna interdum facilisis. Fusce rhoncus dui vel sodales rutrum. Fusce vitae ultrices velit. In volutpat varius diam ac accumsan.
Cras vehicula lacus ac tellus semper, eget volutpat lorem blandit. Nunc congue risus vulputate, rhoncus risus sit amet, malesuada dolor. Curabitur iaculis iaculis nisl, eget condimentum lectus sagittis posuere. Integer ultrices sollicitudin est, et elementum erat ultrices a. Donec quis augue at magna rutrum rhoncus. Ut vehicula et felis nec rutrum. Curabitur eget ullamcorper sapien. Integer sagittis lorem et velit auctor ultricies. Maecenas vestibulum in ipsum eu vestibulum. Morbi in lectus a eros sodales imperdiet vel vitae mi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam et sem non metus interdum maximus. Quisque pellentesque arcu vitae luctus tristique. Duis malesuada felis vitae elit facilisis pretium.
Sed sed odio convallis, elementum elit ac, imperdiet nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam ut purus diam. Cras congue suscipit tincidunt. Maecenas ornare auctor tortor, at viverra dui placerat eget. Ut vitae elementum justo. Donec cursus enim id arcu tincidunt, ac suscipit mi congue. Nullam ut libero vel turpis vestibulum vehicula quis consectetur felis. Sed sed erat elit. Phasellus lacinia mauris molestie massa fermentum mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla vel diam faucibus, sollicitudin quam a, lobortis ligula. Cras augue erat, tempor sed nibh vitae, lobortis suscipit leo. Ut pellentesque lectus eu urna elementum, ac convallis neque hendrerit.
Nullam rutrum enim eu sodales eleifend. Aenean id erat sagittis, condimentum lorem tincidunt, finibus nisi. Donec fringilla placerat viverra. Nunc dignissim, dui id finibus consectetur, turpis dolor placerat metus, eget molestie nibh velit sit amet nunc. Aliquam vel leo libero. Cras rhoncus, tellus quis fringilla rutrum, lectus eros finibus leo, in mollis felis libero egestas dui. Donec blandit imperdiet diam, et facilisis neque molestie eleifend. Mauris accumsan lacus vitae ex mollis dictum. In sagittis massa massa, in ornare turpis malesuada eget. Ut malesuada nisi aliquam posuere semper. Curabitur metus nunc, pulvinar non sem id, dapibus pretium quam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In hac habitasse platea dictumst.`

const html = `<span>Yup This is a <b>Test</b> Yea <img src="/blabla.png" /> Its Ok?</span>`

describe('Pattern Grab Test', () => {
  it('getPositions Test', () => {
    const cases: [RegExp, string][] = [
      [/Cras/g, 'Cras'],
      [/Lorem/g, 'Lorem'],
      [/ /g, ' ']
    ]

    for (const caseItem of cases) {
      const [regex, result] = caseItem
      const positions = getPositions(regex, text)
      for (const position of positions) {
        const founded = text.substr(position[0], position[1] - position[0])
        expect(founded).toBe(result)
      }
    }
  })

  it('patternGrab Test', () => {
    const grabHTML = patternGrab({ regex: /<[^>]*>/gm, string: html })
    const expectedData = [
      '<span>',
      'Yup This is a ',
      '<b>',
      'Test',
      '</b>',
      ' Yea ',
      '<img src="/blabla.png" />',
      ' Its Ok?',
      '</span>'
    ]
    expect(grabHTML.data).toMatchObject(expectedData)
    expect(grabHTML.positions).toMatchObject([0, 2, 4, 6, 8])

    const grabPlain = patternGrab({ regex: /<[^>]*>/gm, string: text })
    expect(grabPlain.data).toMatchObject([])

    const grabNotFirst = patternGrab({ regex: /Yup/gm, string: html })
    expect(grabNotFirst.data).toMatchObject(['<span>', 'Yup'])

    const grabEndPlainRemainHTML = patternGrab({
      regex: /<[^>]*>/gm,
      string: `${html} Remain?`
    })
    expect(grabEndPlainRemainHTML.data).toMatchObject([
      ...expectedData,
      ' Remain?'
    ])
  })
})
