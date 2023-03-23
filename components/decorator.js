import React from "react";

import { Session } from "../model/";
import { Container, Loader, Icon } from "../components/";
import { memory, currentShare } from "../helpers/";
import { t } from "../locales/";

import "../pages/error.scss";

export function LoggedInOnly(WrappedComponent) {
    memory.set("user::authenticated", false);

    return class DecoratedLoggedInOnly extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                is_logged_in: memory.get("user::authenticated"),
            };
        }

        componentDidMount() {
            if (this.state.is_logged_in === false && currentShare() === null) {
                Session.currentUser().then((res) => {
                    if (res.is_authenticated === false) {
                        this.props.error({ message: "Authentication Required" });
                        return;
                    }
                    memory.set("user::authenticated", true);
                    this.setState({ is_logged_in: true });
                }).catch((err) => {
                    if (err.code === "NO_INTERNET") {
                        this.setState({ is_logged_in: true });
                        return;
                    }
                    this.props.error(err);
                });
            }
        }

        render() {
            if (this.state.is_logged_in === true || currentShare() !== null) {
                return <WrappedComponent {...this.props} />;
            }
            return null;
        }
    };
}

export function ErrorPage(WrappedComponent) {
    return class DecoratedErrorPage extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                error: null,
                trace: null,
                showTrace: false,
            };
        }

        update(obj) {
            this.setState({
                error: obj,
                trace: new URLSearchParams(location.search).get("trace") || null,
            });
        }

        render() {
            if (this.state.error !== null) {
                const message = this.state.error.message || t("There is nothing in here");
                return (
                    <div>
                        <a href="/" className="backnav"><Icon name="arrow_left" />home</a>
                        <Container>
                            <div
                                className="error-page"
                                onClick={() => this.setState({ showTrace: true })}>
                                <h1>{ t("Oops!") }</h1>
                                <h2>{ t(message) }</h2>
                                { this.state.showTrace && this.state.trace &&
                                  <code> { this.state.trace }</code> }
                            </div>
                        </Container>
                    </div>
                );
            }
            return (
                <WrappedComponent error={this.update.bind(this)} {...this.props} />
            );
        }
    };
}

export const LoadingPage = () => {
    return (
        <div style={{ marginTop: parseInt(window.innerHeight / 3) + "px" }}>
            <Loader />
        </div>
    );
};
