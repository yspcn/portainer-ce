import _ from 'lodash-es';

import { UserTokenModel, UserViewModel } from '@/portainer/models/user';
import { getUsers } from '@/portainer/users/user.service';
import { getUser } from '@/portainer/users/queries/useUser';

import { TeamMembershipModel } from '../../models/teamMembership';

/* @ngInject */
export function UserService($q, Users, TeamService, TeamMembershipService) {
  'use strict';
  var service = {};

  service.users = async function (includeAdministrators, environmentId) {
    const users = await getUsers(includeAdministrators, environmentId);

    return users.map((u) => new UserViewModel(u));
  };

  service.user = async function (userId) {
    const user = await getUser(userId);

    return new UserViewModel(user);
  };

  service.createUser = function (username, password, role, teamIds) {
    var deferred = $q.defer();

    var payload = {
      username: username,
      password: password,
      role: role,
    };

    Users.create({}, payload)
      .$promise.then(function success(data) {
        var userId = data.Id;
        var teamMembershipQueries = [];
        angular.forEach(teamIds, function (teamId) {
          teamMembershipQueries.push(TeamMembershipService.createMembership(userId, teamId, 2));
        });
        $q.all(teamMembershipQueries).then(function success() {
          deferred.resolve();
        });
      })
      .catch(function error(err) {
        deferred.reject({ msg: 'Unable to create user', err: err });
      });

    return deferred.promise;
  };

  service.deleteUser = function (id) {
    return Users.remove({ id: id }).$promise;
  };

  service.updateUser = function (id, { newPassword, role, username }) {
    return Users.update({ id }, { newPassword, role, username }).$promise;
  };

  service.updateUserPassword = function (id, currentPassword, newPassword) {
    var payload = {
      Password: currentPassword,
      NewPassword: newPassword,
    };

    return Users.updatePassword({ id: id }, payload).$promise;
  };

  service.updateUserTheme = function (id, theme) {
    return Users.updateTheme({ id }, { theme }).$promise;
  };

  service.userMemberships = function (id) {
    var deferred = $q.defer();

    Users.queryMemberships({ id: id })
      .$promise.then(function success(data) {
        var memberships = data.map(function (item) {
          return new TeamMembershipModel(item);
        });
        deferred.resolve(memberships);
      })
      .catch(function error(err) {
        deferred.reject({ msg: '无法检索用户成员身份', err: err });
      });

    return deferred.promise;
  };

  service.userLeadingTeams = function (id) {
    var deferred = $q.defer();

    $q.all({
      teams: TeamService.teams(),
      memberships: service.userMemberships(id),
    })
      .then(function success(data) {
        var memberships = data.memberships;
        var teams = data.teams.filter(function (team) {
          var membership = _.find(memberships, { TeamId: team.Id });
          if (membership && membership.Role === 1) {
            return team;
          }
        });
        deferred.resolve(teams);
      })
      .catch(function error(err) {
        deferred.reject({ msg: '无法检索用户团队', err: err });
      });

    return deferred.promise;
  };

  service.createAccessToken = function (id, description) {
    const deferred = $q.defer();
    const payload = { description };
    Users.createAccessToken({ id }, payload)
      .$promise.then((data) => {
        deferred.resolve(data);
      })
      .catch(function error(err) {
        deferred.reject({ msg: '无法创建用户', err: err });
      });
    return deferred.promise;
  };

  service.getAccessTokens = function (id) {
    var deferred = $q.defer();

    Users.getAccessTokens({ id: id })
      .$promise.then(function success(data) {
        var userTokens = data.map(function (item) {
          return new UserTokenModel(item);
        });
        deferred.resolve(userTokens);
      })
      .catch(function error(err) {
        deferred.reject({ msg: '无法检索用户令牌', err: err });
      });

    return deferred.promise;
  };

  service.deleteAccessToken = function (id, tokenId) {
    return Users.deleteAccessToken({ id: id, tokenId: tokenId }).$promise;
  };

  service.initAdministrator = function (username, password) {
    return Users.initAdminUser({ Username: username, Password: password }).$promise;
  };

  service.administratorExists = function () {
    var deferred = $q.defer();

    Users.checkAdminUser({})
      .$promise.then(function success() {
        deferred.resolve(true);
      })
      .catch(function error(err) {
        if (err.status === 404) {
          deferred.resolve(false);
        }
        deferred.reject({ msg: '无法验证管理员账户是否存在', err: err });
      });

    return deferred.promise;
  };

  return service;
}
