/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { FC, useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { usePageTags } from '@/hooks';
import { Empty } from '@/components';
import { getReviewType } from '@/services';
import type * as Type from '@/common/interface';

import { Filter, FlagContent, SuggestEditContent } from './components';

const Index: FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'page_review' });
  const [reviewTypeList, setReviewTypeList] = useState<Type.ReviewTypeItem[]>();
  const [currentReviewType, setCurrentReviewType] = useState('');

  const fetchReviewType = () => {
    getReviewType()
      .then((resp) => {
        const filterData = resp.filter((item) => item.todo_amount > 0);
        if (filterData.length > 0) {
          setCurrentReviewType(filterData[0].name);
        }
        setReviewTypeList(resp);
      })
      .catch((ex) => {
        console.error('getReviewType error: ', ex);
      });
  };

  useEffect(() => {
    fetchReviewType();
  }, []);

  usePageTags({
    title: t('review'),
  });

  return (
    <Row className="pt-4 mb-5">
      <h3 className="mb-4">{t('review')}</h3>
      <Col className="page-main flex-auto">
        {currentReviewType === 'suggested_post_edit' && <SuggestEditContent />}

        {/* {currentReviewType === 'flagged_post' && <FlagContent />} */}
        <FlagContent />
        <Empty>{t('empty')}</Empty>
      </Col>

      <Col className="page-right-side mt-4 mt-xl-0">
        <Filter
          list={reviewTypeList}
          checked={currentReviewType}
          callback={(name) => {
            setCurrentReviewType(name);
          }}
        />
      </Col>
    </Row>
  );
};

export default Index;
