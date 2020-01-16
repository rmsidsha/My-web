import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render() {
        if (this.loggedIn) {
            return (<LoggedIn />);
        } else {
            return (<Home />)
        }
    }
}

class Home extends React.Component {
    render() {
        return (
            <div className ="container">
                <div className="col-xs-8 col-xs-offset-2 jumbotron text-center">
                    <h1>Seo Eunu</h1>
                    <p>진짜 될까</p>
                    <p>Sign in to get access</p>
                    <a onClick={this.authenticate} className="btn btn-primary btn-lg btn login btn-block">sign in</a>
                </div>
            </div>
        )
    }
}

class LoggedIn extends React.Component {
    constructor(props) {
        super(props) 
            super(props);
            this.state = {
                seos:[]
            }
        }

    render() {
        return (
            <div className="container">
                <div className="col-lg-12">
                    <br />
                    <span className="pull-right"><a onClick={this.logout}>logout</a></span>
                    <h2>SeoEunu</h2>
                    <p>Hi im nunu</p>
                    <div className="row">
                        {this.state.seos.map(function(seo, i){
                            return (<Seo key={i} seo={seo} />);
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

class Seo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            seos: ""
        }
        this.seo = this.seo.bind(this);
    }
    seo(){
        //block
    }
    render() {
        return (
            <div className="col-xs-4">
                <div className="panel panel-default">
                    <div className="panel-heading">#{this.props.seo.id} <span className="pull-right">{this.state.seos}</span></div>
                    <div className="panel-body">
                        {this.props.seo.seo}
                    </div>
                    <div className="panel-footer">
                        {this.props.seo.seos} seos &nbsp;
                        <a onClick={this.seo} className="btn btn-default">
                            <span className="glyphicon glyphicon-thumbs-up"></span>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
