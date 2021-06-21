import { ResourceControlOwnership as RCO } from 'Portainer/models/resourceControl/resourceControlOwnership';

angular.module('portainer.app').factory('FormValidator', [
  function FormValidatorFactory() {
    'use strict';

    var validator = {};

    validator.validateAccessControl = function (accessControlData, isAdmin) {
      if (!accessControlData.AccessControlEnabled) {
        return '';
      }

      if (isAdmin && accessControlData.Ownership === RCO.RESTRICTED && accessControlData.AuthorizedUsers.length === 0 && accessControlData.AuthorizedTeams.length === 0) {
        return '您必须至少指定一个团队或用户。';
      } else if (!isAdmin && accessControlData.Ownership === RCO.RESTRICTED && accessControlData.AuthorizedTeams.length === 0) {
        return '您必须至少指定一个团队。';
      }
      return '';
    };

    return validator;
  },
]);
