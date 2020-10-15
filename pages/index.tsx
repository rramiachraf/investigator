import { ChangeEvent, Component, createRef, RefObject } from 'react'

class Home extends Component {
  fileInputRef = createRef() as RefObject<HTMLInputElement>
  state = {
    displayButton: true,
    outdated: []
  }
  handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState(() => ({ displayButton: false }))

    const { files } = e.target
    const reader = new FileReader()
    reader.readAsText(files[0])

    reader.onload = () => {
      const result = reader.result as string
      const { dependencies, devDependencies } = JSON.parse(result)
      const totalDependencies = { ...dependencies, ...devDependencies }

      const modules = Object.keys(totalDependencies).map(module => ({
        name: module,
        version: totalDependencies[module].replace(/^(\^|\~)/, '')
      }))

      modules.forEach(async ({ name, version }) => {
        const response = await fetch(`/api/package?name=${name}`)
        const { latestVersion } = await response.json()

        if (version !== latestVersion) {
          this.setState(() => ({
            outdated: [
              ...this.state.outdated,
              { name, version, upToDate: latestVersion === version }
            ]
          }))
        }
      })
    }
  }

  render() {
    return (
      <div className="parent">
        <h1 className="logo">Investigator</h1>
        <input
          ref={this.fileInputRef}
          type="file"
          accept="application/json"
          onChange={this.handleFileChange}
          hidden
        />
        {this.state.displayButton && (
          <button
            className="upload-button"
            onClick={() => this.fileInputRef.current.click()}
          >
            Browse
          </button>
        )}
        {this.state.outdated.length > 0 && (
          <>
            <p>
              You have {this.state.outdated.length} outdated packages.
            </p>
          </>
        )}
        <style jsx>{`
          .parent {
            background: #1a1a2e;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            gap: 2rem;
            padding: 0 30%;
          }
          .logo {
            font-size: 6rem;
            color: white;
            font-weight: 700;
            text-transform: uppercase;
          }
          .upload-button {
            padding: 1rem 3rem;
            font-weight: 500;
            font-size: 1.5rem;
            cursor: pointer;
            border: none;
            background: #ea5455;
            color: white;
            text-transform: capitalize;
            box-shadow: -6px 6px 0 #ffcb74;
            transition: 0.3s box-shadow ease-in;
          }
          .upload-button:hover,
          .upload-button:active {
            box-shadow: -3px 3px 0 #ffcb74, -6px 6px 0 #ff9a76;
          }
          p {
            color: white;
            font-size: 1.4rem;
          }
        `}</style>
      </div>
    )
  }
}

export default Home
