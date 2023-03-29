import { expect } from 'chai'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import SignUpPage from '@/pages/SignUpPage.vue'

describe('SignUpPage.vue Component Test', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SignUpPage, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    })
  })

  it('Mount test', async() => {
    expect(wrapper.text()).to.include('Sign Up');
    expect(wrapper.text()).to.include('Email Address');
    expect(wrapper.text()).to.include('Password');
    expect(wrapper.text()).to.include('Already have an account?');
  })
})