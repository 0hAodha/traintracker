import { expect } from 'chai'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import { nextTick } from 'vue'
import Navbar from '@/components/Navbar.vue'

describe('Navbar.vue Component Test', () => {
  let wrapper;
  let componentInstance;
  beforeEach(() => {
    wrapper = shallowMount(Navbar, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    })
    componentInstance = wrapper.vm;
  })

  it('Not logged in test', () => {
    expect(wrapper.text()).to.include('Irish Rail Tracker');
    expect(wrapper.text()).to.include('Home');
    expect(wrapper.text()).to.include('Insights');
    expect(wrapper.text()).to.include('Login');
    expect(wrapper.text()).to.include('Sign Up');
  }),

  it('Logged in test', () => {
    // re-render the component
    wrapper.setData({isLoggedIn: true})
    nextTick(() => {
      expect(wrapper.text()).to.include('Irish Rail Tracker');
      expect(wrapper.text()).to.include('Home');
      expect(wrapper.text()).to.include('Insights');
      expect(wrapper.text()).to.include('Account Settings');
      expect(wrapper.text()).to.include('Logout');
    })
  })
})


// wrapper.find('input[type=checkbox]').setChecked();