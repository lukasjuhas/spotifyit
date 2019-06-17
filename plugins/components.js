import Vue from 'vue';
import SocialSharing from 'vue-social-sharing';

Vue.use(SocialSharing);

const components = {
  SocialSharing,
};

Object.values(components).forEach(item => Vue.use(item));
