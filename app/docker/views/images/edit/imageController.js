import _ from 'lodash-es';
import { PorImageRegistryModel } from 'Docker/models/porImageRegistry';
import { confirmImageExport } from '@/react/docker/images/common/ConfirmExportModal';
import { confirmDelete } from '@@/modals/confirm';

angular.module('portainer.docker').controller('ImageController', [
  '$async',
  '$q',
  '$scope',
  '$transition$',
  '$state',
  'Authentication',
  'ImageService',
  'ImageHelper',
  'RegistryService',
  'Notifications',
  'HttpRequestHelper',
  'FileSaver',
  'Blob',
  'endpoint',
  'RegistryModalService',
  function (
    $async,
    $q,
    $scope,
    $transition$,
    $state,
    Authentication,
    ImageService,
    ImageHelper,
    RegistryService,
    Notifications,
    HttpRequestHelper,
    FileSaver,
    Blob,
    endpoint,
    RegistryModalService
  ) {
    $scope.endpoint = endpoint;
    $scope.isAdmin = Authentication.isAdmin();

    $scope.formValues = {
      RegistryModel: new PorImageRegistryModel(),
    };

    $scope.state = {
      exportInProgress: false,
      pullImageValidity: false,
    };

    $scope.sortType = 'Order';
    $scope.sortReverse = false;

    $scope.order = function (sortType) {
      $scope.sortReverse = $scope.sortType === sortType ? !$scope.sortReverse : false;
      $scope.sortType = sortType;
    };

    $scope.toggleLayerCommand = function (layerId) {
      $('#layer-command-expander' + layerId + ' span').toggleClass('glyphicon-plus-sign glyphicon-minus-sign');
      $('#layer-command-' + layerId + '-short').toggle();
      $('#layer-command-' + layerId + '-full').toggle();
    };

    $scope.setPullImageValidity = setPullImageValidity;
    function setPullImageValidity(validity) {
      $scope.state.pullImageValidity = validity;
    }

    $scope.tagImage = function () {
      const registryModel = $scope.formValues.RegistryModel;

      const image = ImageHelper.createImageConfigForContainer(registryModel);

      ImageService.tagImage($transition$.params().id, image.fromImage)
        .then(function success() {
          Notifications.success('成功', '镜像标记成功');
          $state.go('docker.images.image', { id: $transition$.params().id }, { reload: true });
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法标记镜像');
        });
    };

    $scope.pushTag = pushTag;

    async function pushTag(repository) {
      return $async(async () => {
        try {
          const registryModel = await RegistryModalService.registryModal(repository, $scope.registries);

          if (registryModel) {
            $('#uploadResourceHint').show();
            await ImageService.pushImage(registryModel);
            Notifications.success('镜像成功推送', repository);
          }
        } catch (err) {
          Notifications.error('失败', err, '无法推送镜像到仓库');
        } finally {
          $('#uploadResourceHint').hide();
        }
      });
    }

    $scope.pullTag = pullTag;
    async function pullTag(repository) {
      return $async(async () => {
        try {
          const registryModel = await RegistryModalService.registryModal(repository, $scope.registries);
          if (registryModel) {
            $('#downloadResourceHint').show();
            await ImageService.pullImage(registryModel);
            Notifications.success('镜像成功拉取', repository);
          }
        } catch (err) {
          Notifications.error('失败', err, '无法从仓库拉取镜像');
        } finally {
          $('#downloadResourceHint').hide();
        }
      });
    }

    $scope.removeTag = function (repository) {
      return $async(async () => {
        if (!(await confirmDelete('确定要删除此标签吗？'))) {
          return;
        }

        ImageService.deleteImage(repository, false)
          .then(function success() {
            if ($scope.image.RepoTags.length === 1) {
              Notifications.success('镜像成功删除', repository);
              $state.go('docker.images', {}, { reload: true });
            } else {
              Notifications.success('标签成功删除', repository);
              $state.go('docker.images.image', { id: $transition$.params().id }, { reload: true });
            }
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除镜像');
          });
      });
    };

    $scope.removeImage = function (id) {
      return $async(async () => {
        if (!(await confirmDelete('删除此镜像将删除所有相关标签。确定要删除此镜像吗？'))) {
          return;
        }

        ImageService.deleteImage(id, false)
          .then(function success() {
            Notifications.success('镜像成功删除', id);
            $state.go('docker.images', {}, { reload: true });
          })
          .catch(function error(err) {
            Notifications.error('失败', err, '无法删除镜像');
          });
      });
    };

    function exportImage(image) {
      HttpRequestHelper.setPortainerAgentTargetHeader(image.NodeName);
      $scope.state.exportInProgress = true;
      ImageService.downloadImages([{ tags: image.RepoTags, id: image.Id }])
        .then(function success(data) {
          var downloadData = new Blob([data.file], { type: 'application/x-tar' });
          FileSaver.saveAs(downloadData, 'images.tar');
          Notifications.success('成功', '镜像下载成功');
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法下载镜像');
        })
        .finally(function final() {
          $scope.state.exportInProgress = false;
        });
    }

    $scope.exportImage = function (image) {
      if (image.RepoTags.length === 0 || _.includes(image.RepoTags, '<none>')) {
        Notifications.warning('', '无法下载未标记的镜像');
        return;
      }

      confirmImageExport(function (confirmed) {
        if (!confirmed) {
          return;
        }
        exportImage(image);
      });
    };

    async function initView() {
      HttpRequestHelper.setPortainerAgentTargetHeader($transition$.params().nodeName);

      try {
        $scope.registries = await RegistryService.loadRegistriesForDropdown(endpoint.Id);
      } catch (err) {
        this.Notifications.error('失败', err, '无法加载注册表');
      }

      $q.all({
        image: ImageService.image($transition$.params().id),
        history: ImageService.history($transition$.params().id),
      })
        .then(function success(data) {
          $scope.image = data.image;
          $scope.history = data.history;
          $scope.image.Env = _.sortBy($scope.image.Env, _.toLower);
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索镜像详细信息');
          $state.go('docker.images');
        });
    }

    initView();
  },
]);
