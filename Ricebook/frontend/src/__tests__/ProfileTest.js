import { mount, shallow } from 'enzyme';
import Profile from '../components/profile';
import { requestUsers } from '../util';

describe('Article actions', () => {
    let wrapper;
    let instance;
    beforeAll(async () => {
        localStorage.clear();
        await requestUsers();
        localStorage["user"] = JSON.stringify(JSON.parse(localStorage["users"])[0]);
        wrapper = mount(<Profile />);
    });

    it("login user's username", () => {
        expect(wrapper.state('user').aName).toEqual("Bret");
    });
});