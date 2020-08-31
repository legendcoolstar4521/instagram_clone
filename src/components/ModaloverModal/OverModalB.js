import React, { Component } from 'react';
import classes from './OverModal.module.css';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import OverBackdrop from './OverBackdrop';
class OverModal extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }
    render() {
        return (
            <Aux>
                <OverBackdrop show={this.props.show} clicked={this.props.modalClosed} Bcolor="rgba(0,0,0, 0.5)" />
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
export default OverModal;
