const AUTH0_CLIENT_ID = "XK7W9QQMlpO930CHf2q2a78OZQunCKn3";
const AUTH0_DOMAIN = "dev-3q2vmqzp.auth0.com";
const AUTH0_CALLBACK_URL = location.href;
const AUTH0_API_AUDIENCE = "golang-gin";

class App extends React.Component {
    parseHash(){
        this.auth0 = new this.auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
        });
        this.auth0.parseHash(window.location.hash, (err, authResult) => {
            if (err) {
                return console.log(err);
            }
            if (
                authResult !== null &&
                authResult.accessToken !== null &&
                authResult.idToken !==null
            ) {
                localStorage.setItem("access_token", authResult.accessToken);
                localStorage.setItem("id_token", authResult.idToken);
                localStorage.setItem(
                    "profile",
                    JSON.stringify(authResult.idTokenPayload)
                );
                window.locatio = window.location.href.suvstr(
                    0,
                    window.location.href.indexOf("#")
                );
            }
        });
    }
    setup() {
        $.ajaxSetup({
            beforeSend: (r) => {
                if (localStorage.getItem("access_token")) {
                    r.setRequestHeader(
                        "Authorization",
                        "Bearer " + localStorage.getItem("access_token")
                    );
                }
            }
        });
    }
    setState() {
        let idToken = localStorage.getItem("id_token");
        if (idToken) {
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }
    }

    componentWillMount() {
        this.setup();
        this.parseHash();
        this.setState();
    }

    render() {
        if (this.loggedIn) {
            return (<LoggedIn />);
        } else {
            return (<Home />);
        }
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
    }
    authenticate() {
        this.WebAuth = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
            scope: "openid profile",
            audience: AUTH0_API_AUDIENCE,
            responseType: "token id_token",
            redirectUri: AUTH0_CALLBACK_URL
        });
        this.WebAuth.authorize();
    }
    render() {
        return (
            <div className="container">
        <div className="col-xs-8 col-xs-offset-2 jumbotron text-center">
          <h1>Seo Eunu</h1>
          <p>This is my web</p>
          <p>sign in to get access</p>
          <a onClick={this.authenticate} className="btn btn-primary btn-lg btn-login btn-block">Sign In</a>
        </div>
      </div>
        );
    }
}

class LoggedIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seos:[]
        };

        this.serverRequest = this.serverRequest.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("profile");
        location.reload();
    }

    serverRequest() {
        $.get("http://localhost:8080/api/seo", res => {
            this.setState({
                seos:res
            });
        });
    }

    componentDidMount() {
        this.serverRequest();
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
        );
    }
}

class Seo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seos: ""
        }
        this.seo = this.seo.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
    }
    seo(){
        let seo = this.props.joke;
        this.serverRequest(seo);
    }
    serverRequest(seo) {
        $.post(
            "http://localhost:8080/api/seo/eunu/" + seo.id,
            { seos: 1},
            res => {
                console.log("res.... ", res);
                this.setState({ eunu: "eunu!", seos: res});
                this.props.seos = res;
            }
        );
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
        );
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
