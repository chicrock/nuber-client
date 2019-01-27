import axios from "axios";
import React from "react";
import { Mutation, Query } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { USER_PROFILE } from "src/sharedQueries";
import {
  updateProfile,
  updateProfileVariables,
  userProfile,
} from "../../types/api";
import EditAccountPresenter from "./EditAccountPresenter";
import { UPDATE_PROFILE } from "./EditAccountQueries";

interface IState {
  email: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  uploading: boolean;
}

interface IProps extends RouteComponentProps<any> {}

class UpdateProfileMutation extends Mutation<
  updateProfile,
  updateProfileVariables
> {}

class ProfileQuery extends Query<userProfile> {}

class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    email: "",
    firstName: "",
    lastName: "",
    profilePhoto: "",
    uploading: false,
  };
  public render() {
    const { email, firstName, lastName, profilePhoto, uploading } = this.state;

    return (
      <UpdateProfileMutation
        mutation={UPDATE_PROFILE}
        refetchQueries={[{ query: USER_PROFILE }]}
        onCompleted={data => {
          const { UpdateMyProfile } = data;
          if (UpdateMyProfile.ok) {
            toast.success("Profile updated!");
          } else if (UpdateMyProfile.error) {
            toast.error(UpdateMyProfile.error);
          }
        }}
        variables={{
          email,
          firstName,
          lastName,
          profilePhoto,
        }}
      >
        {(updateProfileFn, { loading }) => (
          <ProfileQuery
            query={USER_PROFILE}
            fetchPolicy="cache-and-network"
            onCompleted={this.updateFields}
          >
            {({}) => (
              <EditAccountPresenter
                email={email}
                firstName={firstName}
                lastName={lastName}
                profilePhoto={profilePhoto}
                onInputChange={this.onInputChange}
                loading={loading}
                onSubmit={updateProfileFn}
                uploading={uploading}
              />
            )}
          </ProfileQuery>
        )}
      </UpdateProfileMutation>
    );
  }
  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const {
      target: { name, value, files },
    } = event;

    const {
      REACT_APP_CLOUDINARY_KEY,
      REACT_APP_CLOUDINARY_PRESET,
    } = process.env;

    if (files) {
      this.setState({
        uploading: true,
      });

      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("api_key", REACT_APP_CLOUDINARY_KEY || "");
      formData.append("upload_preset", REACT_APP_CLOUDINARY_PRESET || "");
      formData.append("timestamp", String(Date.now() / 1000));

      const {
        data: { secure_url },
      } = await axios.post(
        "https://api.cloudinary.com/v1_1/chicrock/image/upload",
        formData
      );

      if (secure_url) {
        this.setState({
          profilePhoto: secure_url,
          uploading: false,
        });
      }
    }

    this.setState({
      [name]: value,
    } as any);
  };

  public updateFields = (data: {} | userProfile) => {
    if (data && "GetMyProfile" in data) {
      const {
        GetMyProfile: { user },
      } = data;

      if (user) {
        const { email, firstName, lastName, profilePhoto } = user;
        const {
          email: sEmail,
          firstName: sFirstName,
          lastName: sLastName,
          profilePhoto: sProfilePhoto,
        } = this.state;

        if (!sEmail && !sFirstName && !sLastName && !sProfilePhoto) {
          this.setState({
            email,
            firstName,
            lastName,
            profilePhoto,
            uploaded: profilePhoto !== null,
          } as any);
        }
      }
    }
  };
}

export default EditAccountContainer;
