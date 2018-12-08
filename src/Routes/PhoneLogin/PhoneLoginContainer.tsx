import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneLoginPresenter from "./PhoneLoginPresenter";

interface IProps extends RouteComponentProps<any> {}

interface IState {
  countryCode: string;
  phoneNumber: string;
}

class PhoneLoginContainer extends React.Component<IProps, IState> {
  public state = {
    countryCode: "+82",
    phoneNumber: "",
  };

  public render() {
    const { countryCode, phoneNumber } = this.state;
    return (
      <PhoneLoginPresenter
        countryCode={countryCode}
        phoneNumber={phoneNumber}
        onInputChange={this.onInputChange}
        onSubmit={this.onSubmit}
      />
    );
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = event => {
    const {
      target: { name, value },
    } = event;

    this.setState({
      [name]: value,
    } as any);
  };

  public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    const { countryCode, phoneNumber } = this.state;
    const fullNumber = `${countryCode}${phoneNumber}`;

    const isValid = /^\+[0-9]{1,4}[0-9]{7,11}$/.test(fullNumber);
    const phoneNumberValid = /^[0-9]{9,11}$/.test(phoneNumber);

    // tslint:disable-next-line
    // console.log(countryCode, phoneNumber);

    if (isValid && phoneNumberValid) {
      return;
    } else {
      toast.error("Please write a valid phone number");
    }
  };
}
export default PhoneLoginContainer;
