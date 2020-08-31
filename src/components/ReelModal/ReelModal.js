import React, { Component } from 'react';
import classes from './ReelModal.module.css';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import ReelBackdrop from './ReelBackdrop';
class ReelModal extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }
    render() {
        return (
            <Aux>
                <ReelBackdrop show={this.props.show} clicked={this.props.modalClosed} Bcolor="rgba(0,0,0, 0.5)" />
                <div className={classes.Modal}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0', ...this.props.style
                    }}>
                    {this.props.children}
                </div>
            </Aux>)
    };
}
export default ReelModal;
