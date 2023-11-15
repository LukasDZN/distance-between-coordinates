import { getDistance } from 'geolib'
import { ReactElement, useState } from 'react'

const processLines = (text: string) => {
  const lines = text.split('\n')
  const filteredLines = lines.filter((line) => {
    const isEmptyLine = line.trim() === ''
    const isResultLine = line.includes('Distance from')
    const isCoordinateLine = line.includes(',')

    const isValidLine = !isEmptyLine && !isResultLine && isCoordinateLine

    // console.log(`line: ${line} isEmptyLine: ${isEmptyLine}, isResultLine: ${isResultLine}, isCoordinateLine: ${isCoordinateLine}`)
    // console.log(`line: ${line} is accepted? ${isValidLine}`)

    return isValidLine
  })

  return filteredLines
}

const parseCoordinate = (line: string) => {
  try {
    // Extract the coordinates from the line
    const coordinates = line.split(',')
    const latitude = coordinates[0].trim()
    const longitude = coordinates[1].trim()

    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    }
  } catch (error) {
    // If user enters invalid coordinates, just return null and ignore later on
    return null
  }
}

function App(): ReactElement {
  const [textareaContent, setTextareaContent] = useState('')

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      // Delete every line that starts with 'Distance from')
      // setTextareaContent(event.target.value.replace(/^Distance from.*$/gm, ''))

      const textareaContent = event.target.value
      // Get coordinates from each line
      const lines = processLines(textareaContent)

      const originCoordinates = parseCoordinate(lines[0])
      if (!originCoordinates) {
        return setTextareaContent(textareaContent)
      }
      const allOtherCoordinates = lines.slice(1).map(parseCoordinate).filter((coordinate) => coordinate !== null)

      const calculatedDistances = allOtherCoordinates.map((coordinate) => {
        return coordinate && {
          origin: originCoordinates,
          destination: coordinate,
          distance: getDistance(originCoordinates, coordinate),
        }
      })

      const distanceTextArray = calculatedDistances.map((calculatedDistance) => {
        return `Distance from ${calculatedDistance?.origin.latitude},${calculatedDistance?.origin.longitude} to ${calculatedDistance?.destination.latitude},${calculatedDistance?.destination.longitude} = ${calculatedDistance?.distance.toLocaleString()}m`
      })

      const newTextareaContent = lines.join('\n') + '\n\n' + distanceTextArray.join('\n')

      setTextareaContent(newTextareaContent)
    } catch (error) {
      console.error(error)
      setTextareaContent(event.target.value)
    }
  }

  return (
    <div className="p-20 border shadow-xl border-gray-50 rounded-xl">
      <header>
        {/* <div className="flex justify-center">
          <img src={viteLogo} className="w-32 h-32" alt="vite logo" />
          <img src={logo} className="w-32 h-32" alt="React logo" />
          <img
            src={tailwindLogo}
            className="w-32 h-32"
            alt="Tailwind CSS logo"
          />
        </div> */}
        <h1 className="pb-8 text-2xl text-center">Coordinate distance calculator</h1>
        <div className="flex justify-center">
          <textarea className="w-[600px] h-96 center border border-1 pl-1 pr-1 pb-0.5 pt-0.5 rounded border-purple-400 font-mono text-sm bg-purple-100 text-purple-900"
            placeholder={`25.131347,55.185045 <-- This is the origin (all distances are calculated from this point)

25.124087,55.2670
24.83249,52.4234
21.432087,55.8755

Distance from 25.131347,55.185045 to 25.124087,55.2670 = 2,000m`
            }
            onChange={handleTextChange}
            value={textareaContent}>
          </textarea>
        </div>
      </header>
    </div>
  )
}

export default App
