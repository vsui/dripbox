import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { list, upload, download } from '../utils/api';

export default class Home extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  state = {
    files: [],
    selected: null,
  }

  componentDidMount() {
    list()
      .then((items) => {
        console.log(items);
        this.setState({
          files: items,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmit = () => {
    toast('trying as hard as bloody possible...');
    const file = this.state.selected;

    upload(file.name, file)
      .then(() => {
        this.setState({
          files: [...this.state.files, { Key: file.name }],
        });
        toast('Upload successful!');
      })
      .catch(() => {
        toast('Upload unsuccessful');
      });

    // if (file == null) {
    //   return;
    // }
    // const reader = new FileReader();
    // reader.addEventListener('loadend', () => {
    //   upload(file.name, reader.result)
    //     .then(() => {
    //       console.log(typeof reader.result);
    //       this.setState({
    //         files: [...this.state.files, { Key: file.name }],
    //       });
    //       toast('Upload successful!');
    //     })
    //     .catch(() => {
    //       console.log(typeof reader.result);
    //       toast('Upload unsuccessful');
    //     });
    // });
    // reader.readAsArrayBuffer(file);
  }

  render() {
    return (
      <div>
        <h1>{this.props.username}</h1>
        {
          this.state.files.map(({ Key }) => (
            <div key={Key}>
              <h3 key={Key}>{Key}</h3>
              <button onClick={() => download(Key)}>Download</button>
            </div>
          ))
        }
        <input type="file" onChange={e => this.setState({ selected: e.target.files[0] })} />
        <button onClick={this.onSubmit}>Submit</button>
      </div>
    );
  }
}
