import React, { Component } from "react";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import Button from "../../components/Button"
import Paper from "../../components/Paper"
import { Input, } from "../../components/InputField";
import "./ViewTemplate.css";
import EmailInput from "../../build.components/Email-input";
import NameInput from "../../build.components/Name-input";
import 'react-select/dist/react-select.css';
import CityInput from "../../build.components/City-input";
import StateInput from "../../build.components/State-input";
import ZipInput from "../../build.components/Zip-input";
import StreetAddressInput from "../../build.components/StreetAddress-input";
import LanguageInput from "../../build.components/Language-input";
import NationalityInput from "../../build.components/Nationality-input";
import GenderInput from "../../build.components/Gender-input";
import CustomInput from "../../build.components/Custom-input"
import TextInput from "../../build.components/Text-input"
import Jumbotron from "../../components/Jumbotron";

class ViewTemplate extends Component {
 
  state = {
    patronData: {},
    template: [],
    templateName: "",
    _id: "",
    patron_id: '',
    url: "",
  }
  componentDidMount() {
    
    this.loadData();
  }
  loadData= () => {
  API.getTemplate(this.props.match.params.id)
  .then(res => this.setState({ template: res.data.template, templateName: res.data.templateName, _id: res.data._id,}))
    .catch(err => console.log(err));
  };
  createFillableComponent = (componentName,props) => {
    const  components = {
      "EmailInput" : EmailInput,
      "NameInput" : NameInput,
      "CityInput" : CityInput,
      "StateInput" : StateInput,
      "ZipInput" : ZipInput,
      "StreetAddressInput" : StreetAddressInput,
      "GenderInput" : GenderInput,
      "NationalityInput" : NationalityInput,
      "LanguageInput" : LanguageInput,
      "CustomInput" : CustomInput,
      "TextInput" : TextInput,
    }
    console.log(props)
    props.onClick = this.nothing
    
    if(componentName === "TextInput"){
      props.value = props.value
      props.onChange = this.nothing
    } else {
      props.value = this.state.patronData[props.name]
      props.onChange = this.handleFillableChange
    }
    
    const component = React.createElement(components[componentName], props);
    return component;
  }
  handleFillableChange = event => {
    const { name, value } = event.target;
    console.log(value)
    let newPatronData = this.state.patronData
    newPatronData[name] = value    
    this.setState({
      patronData : newPatronData
    });
  };
  nothing = () => {

  }
  handleInputChange = event => {
    const { name, value } = event.target;
 
    this.setState({
      [name]: value
    });
  };
  handleFormSubmit = event => {
    // When the form is submitted, prevent its default behavior, get recipes update the recipes state
    if(!this.state.patronData.firstName || !this.state.patronData.lastName){
      alert("First and Last names are requried!")
    } else {
    const name = `${this.state.patronData.firstName} ${this.state.patronData.lastName}`
    this.updatePatron(name)
    }
 
  }; 
  combinePatronData = data => {
    Object.assign(data.patronData,this.state.patronData)
    this.setState({patronData:data.patronData, patron_id: data._id}, () => {
      API.updatePatron(this.state.patron_id, {
        patronName: `${this.state.patronData.firstName} ${this.state.patronData.lastName}`,
        patronData: this.state.patronData
      })
      .then(res => API.saveFilled({
        patronId: res.data._id,
        templateId: this.state._id,
        filledName: `${this.state.patronData.firstName} ${this.state.patronData.lastName} ${this.state.templateName}`
      })
        .then(res => alert("Patrons and form updated!"))
        .catch(err => console.log(err)))
      .catch(err => console.log(err));
    });
    
    
  }
  updatePatron = (name) => {
    API.getPatronName(name)
      .then(res => this.combinePatronData(res.data))
      .catch(err =>
        API.savePatron({
          patronName: name,
          patronData: this.state.patronData
          })
            .then(res => 
                API.saveFilled({
                  patronId: res.data._id,
                  templateId: this.state._id,
                  filledName: `${this.state.patronData.firstName} ${this.state.patronData.lastName} ${this.state.templateName}`
                })
                  .then(res => alert("Patrons and form created!"))
                  .catch(err => console.log(err))
              )
            .catch(err => console.log(err))
      );
  }
  log = () => {
    console.log(this.state)
  }
  render() {
  return(
    <div>
      <Jumbotron name = {this.templateName} />
  <Container fluid>
    <Row>
      <Col size="md-12" >
      <div style={{width: '50%', margin: 'auto'}}>
              <Input
                width= "35%"
                value={this.state.patronData.firstName}
                onChange={this.handleFillableChange}
                name="firstName"
                placeholder="First Name"
              />
              <Input
                width= "35%"
                value={this.state.patronData.lastName}
                onChange={this.handleFillableChange}
                name="lastName"
                placeholder="Last Name"
              />
        <Button onClick = {this.log} children = "asdf" className = "btn" id="pageButton"/>
        <Button onClick = {this.handleFormSubmit} children = "Post" className = "btn" id="pageButton"/>
        </div>
        {/* ==================== */}
        {/* PAPER */}
        {/* ==================== */}
        <div style={{width: '50%', margin: 'auto'}}>
        <Paper
        right = '10vh'
        display = {this.state.paper}
        children = {this.state.template.map(template => (
          this.createFillableComponent(template.component,template.props)
        ))} 
      />
        </div>
    </Col>
    </Row>
  </Container>
  </div>
)
}}
export default ViewTemplate;
