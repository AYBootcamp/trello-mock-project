import 'swagger-ui-react/swagger-ui.css'

import SwaggerUI from 'swagger-ui-react'

import specJSON from './trello-clone-swagger.json'

const SwaggerApp = () => {
    return <SwaggerUI spec={specJSON} />
}

export default SwaggerApp
