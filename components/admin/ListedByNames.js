import React from 'react';
import { connect } from 'react-redux';
import { skillsFetch, usersFetch } from "../../redux/actions";
import { Popup, Menu, Card, Feed, Icon, Item, FeedLabel, Search, Segment, Dimmer, Loader, Divider, Label } from "semantic-ui-react";
import _ from "lodash";
import { Link } from '../../routes';
import MenuItems from "../dash/MenuItems";
import TechnologiesCards from "./TechnologiesCards";
import EmployeesData from "./EmployeesData";

class EmployeesSkills extends React.Component {

    state = {
        activeName: '', // TODO Set the first one for default
        isLoading: false,
        value: '', // Value of the search Field
        selectedUser: []
    };

    componentDidMount() {
        this.props.usersFetch();
        this.props.skillsFetch();
    }

    handleSkillItemClick = (e, { name }) => {

        this.setState({ activeName: name })
    };
    handleResultSelect = (e, { result }) => this.setState({ activeName: result.displayName, value: result.displayName });

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });
    handleSearchChange = (e, { value }) => {
        const { users } = this.props;
        this.setState({ isLoading: true, value });

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent();

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
            const isMatch = result =>
                re.test(result.displayName)
                || Object.values(result.displayName ? result.displayName : {}).some((tech) => re.test(tech.displayName));
            this.setState({
                isLoading: false,
                results: _.filter(users, isMatch),
            })
        }, 300)
    };

    // techLabel(uid, user) {
    //     const {technologies} = this.props.users;
    //     let techs = {};
    //     technologies.map((val, uid) => {
    //         techs = {...techs, ...val};
    //     });
    //     const tech = user.technologies[uid];
    //     if (!tech || !tech.levelOfKnowledge) return null;
    //     return (
    //         <>
    //             <Divider/>
    //             <Label as='a' color={tech.levelOfKnowledge.color} key={uid}>
    //                 {techs[uid].name}
    //                 <Label.Detail>{tech.levelOfKnowledge.text}</Label.Detail>
    //             </Label>
    //         </>
    //     )
    // }


    render() {
        const { isLoading, results, value, activeName } = this.state;

        const resultRenderer = ({ displayName }) => <Label content={displayName} color='blue' onClick={this.handleSkillItemClick} />;

        const {selectTechToSearch} = this.props.users;
        return (
            <>
                <Menu attached='top' pointing secondary pagination>
                    {/* <MenuItems
                        items={this.props.users.displayName}
                        activeItem={activeName}
                        handleItemClick={this.handleSkillItemClick}
                    /> */}
                    <Menu.Menu position='right'>
                        <Menu.Item>

                            <Search
                                loading={isLoading}
                                onResultSelect={this.handleResultSelect}
                                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                                results={results}
                                resultRenderer={resultRenderer}
                                value={value}
                            />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Card.Group itemsPerRow={3} stackable>
                    {!this.props.loading &&
                        _.map(this.props.users,
                            (item, uid) => {
                                return (

                                    <Popup key={item + uid}
                                        trigger={

                                            <Card key={item + uid}>
                                                <Card.Content>
                                                    <Feed>
                                                        <Feed.Event>
                                                            <Feed.Label image={item.photoURL} />
                                                            <Feed.Content>
                                                                <Feed.Date content={item.displayName} />
                                                                <Feed.Summary>
                                                                    {item.email}
                                                                </Feed.Summary>
                                                            </Feed.Content>
                                                        </Feed.Event>
                                                    </Feed>
                                                </Card.Content>
                                                <Card.Content extra>
                                                    {<Link route={`/employeesSkills/${uid}`}>
                                                        <a>
                                                            <Icon name='coffee' />
                                                            {item.technologies ? Object.keys(item.technologies).length : '0'}
                                                        </a>
                                                    </Link>}
                                                </Card.Content>
                                            </Card>

                                        }
                                        key={item + uid}
                                    >

                                        <Popup.Header>Details</Popup.Header>
                                        {/* <Popup.Content>
                                            {Object.values(item.technologies).map((uid) => {
                                                return this.techLabel(uid, item);
                                            })}
                                        </Popup.Content>  */}

                                    </Popup>
                                );

                            })
                    }
                </Card.Group>
                <Segment attached='bottom' style={{ marginLeft: 0 }}>
                    <Dimmer active={this.props.loading}>
                        <Loader />
                    </Dimmer>
                    {!this.props.loading &&
                        <TechnologiesCards
                            skills={this.props.skills}
                            skillSelected={activeName}
                        />
                    }
                </Segment>

                <Divider />
                <EmployeesData selectedUser={this.state.selectedUser} />
            </>
        )
    }

}


const mapStateToProps = state => {
    console.log(state)
    return {
        skills: state.fireBase.skills,
        users: state.fireBase.users || [],
        selectedUser: state.fireBase.selectUserToSearch
    }
}


export default connect(mapStateToProps, { skillsFetch, usersFetch })(EmployeesSkills)