import React, { Component } from 'react'
import { connect } from 'react-redux'
import web3utils from 'web3-utils'

import Toast from 'grommet/components/Toast'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import Image from 'grommet/components/Image'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      success: '',
      failure: '',
      modalOpen: false,
      data: ''
    }

    this.getAct = this.getAct.bind(this)
  }

  componentDidMount() {
    this.getAct()
  }

  getAct() {
    this.props.Token.deployed().then(async (token) => {
      if(web3utils.isAddress(this.props.account)) {
          token.getAct({ from: this.props.account })
            .then(async (res) => {
              this.props.ipfs.catJSON(res, async (err, data) => {
                if(err) {
                  // console.log(err)
                  this.setState({
                    modalOpen: true,
                    failure: `Error occured: ${err.message}`
                  })
                } else {
                  this.setState({
                    data: data
                  })
                }
              })
            })
            .catch((error) => {
              // console.log(error.message)
              this.setState({
                modalOpen: true,
                failure: `Error occured: ${error.message}`
              })
            })
        } else {
          this.setState({
            modalOpen: true,
            failure: 'Wrong account.'
          })
        }
      })

    setTimeout(() => {
      this.getAct()
    }, 5000)
  }

  render() {
    return (
      <Box align="center">
        <Label>About &amp; How that Does Work</Label>
        <Paragraph>This hosting DApp hosts static websites or any folder of data on IPFSdistribuetd web.</Paragraph>
        <Label>Pricing</Label>
        <Paragraph>...</Paragraph>
        <Label>How to point your own domain to location</Label>
        <Paragraph>...</Paragraph>

        <Box align="center">
          { this.state.data === '' ?
            <Label align="center">Loading...</Label>
            : <Image src={this.state.data} size='large' />
          }
        </Box>
          { this.state.modalOpen && <Toast
            status={this.state.success ? 'ok' : 'critical' }>
              <p>{ this.state.success ? this.state.success : null }</p>
              <p>{ this.state.failure ? this.state.failure : null }</p>
            </Toast>
          }
      </Box>
    )
  }
}

function mapStateToProps(state) {
  return {
    Token: state.Token,
    account: state.account,
    web3: state.web3,
    ipfs: state.ipfs
  }
}

export default connect(mapStateToProps)(Home)
